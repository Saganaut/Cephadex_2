import logging
import mimetypes
from typing import Any, Union
from urllib.parse import urlparse

import aioboto3
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

from dependencies.settings import get_settings

settings = get_settings()


logger = logging.getLogger("App")
log_level = getattr(logging, settings.aws.logging_level.upper(), logging.ERROR)

session = boto3.Session()
async_session = aioboto3.Session()
s3_client = session.client(
    "s3",
    endpoint_url=settings.aws.s3_uri,
    aws_access_key_id=settings.aws.access_key,
    aws_secret_access_key=settings.aws.secret_access_key,
    config=Config(signature_version="s3v4"),
    region_name=settings.aws.default_region,
)

async_s3_client = async_session.client(
    "s3",
    endpoint_url=settings.aws.s3_uri,
    aws_access_key_id=settings.aws.access_key,
    aws_secret_access_key=settings.aws.secret_access_key,
    config=Config(signature_version="s3v4"),
    region_name=settings.aws.default_region,
)

bucket = settings.aws.bucket


class StorageManager:
    @staticmethod
    def create_presigned_url(url: str, expiration: int = 3600) -> str | None:
        """Generate a presigned URL for a file in S3"""
        bucket_name, key = StorageManager.parse_s3_url(url)
        try:
            response = s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": bucket_name, "Key": key},
                ExpiresIn=expiration,
            )
        except Exception:
            logger.exception("failed to create presigned url")
            return None
        return response

    @staticmethod
    async def async_create_presigned_url(url: str, expiration: int = 3600) -> str | None:
        """Generate a presigned URL for a file in S3"""
        bucket_name, key = StorageManager.parse_s3_url(url)
        try:
            response = await async_s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": bucket_name, "Key": key},
                ExpiresIn=expiration,
            )
        except Exception:
            logger.exception("failed to create presigned url")
            return None
        return response

    @staticmethod
    def upload_to_s3(folder: str, file_name: str, object_name: str | None = None) -> bool:
        """Upload a file to an S3 bucket

        :param bucket: Bucket to upload to
        :param folder: Folder in bucket to upload to
        :param file_name: File to upload
        :param object_name: S3 object name. If not specified then file_name is used
        :return: True if file was uploaded, else False
        """
        if object_name is None:
            object_name = file_name

        if folder:
            object_name = f"{folder}/{object_name}"

        # Set the content-type by guessing from the file name
        content_type, _ = mimetypes.guess_type(object_name)
        if content_type is None:
            content_type = "application/octet-stream"  # Use a binary type as a fallback

        try:
            s3_client.upload_file(
                file_name,
                bucket,
                object_name,
                ExtraArgs={"ContentType": content_type},
            )

            return True
        except ClientError:
            logger.exception("Failed to upload %s", file_name)
            return False

    @staticmethod
    async def async_upload_to_s3(
        folder: str,
        file_name: str,
        object_name: str | None = None,
    ) -> bool:
        if object_name is None:
            object_name = file_name
        if folder:
            object_name = f"{folder}/{object_name}"
        content_type, _ = mimetypes.guess_type(object_name)

        try:
            async with async_s3_client as client:  # type: ignore
                await client.upload_file(
                    file_name,
                    bucket,
                    object_name,
                    ExtraArgs={"ContentType": content_type},
                )
        except ClientError:
            logger.exception("Failed to upload %s", file_name)
            return False
        return True

    @staticmethod
    async def async_get_s3_object_in_folder(
        folder_name: str,
        object_name: str,
    ) -> Union[bool, Any]:  # noqa: ANN401
        object_key = f"{folder_name}/{object_name}"

        try:
            async with session.client("s3") as client:  # type: ignore
                return await client.get_object(Bucket=bucket, Key=object_key)
        except ClientError:
            logger.exception("Could not find %s in %s error", object_key, bucket)
            return False

    @staticmethod
    def get_s3_object_in_folder(folder_name: str, object_name: str) -> Union[bool, Any]:  # noqa: ANN401
        object_key = f"{folder_name}/{object_name}"
        try:
            return s3_client.get_object(Bucket=bucket, Key=object_key)
        except ClientError:
            logger.exception("Could not find %s in %s error", object_key, bucket)
            return False

    ## TODO figure out why in test mode objects are not getting deleted
    @staticmethod
    async def async_delete_s3_object_in_folder(
        folder_name: str,
        object_name: str,
    ) -> bool:
        succesful_response = 204
        object_key = f"{folder_name}/{object_name}"
        try:
            async with async_session.client("s3") as client:  # type: ignore
                response = await client.delete_object(Bucket=bucket, Key=object_key)
                if response["ResponseMetadata"]["HTTPStatusCode"] == succesful_response:
                    return True

                logger.exception(
                    "Failed to delete %s from %s. Response: %s",
                    object_key,
                    bucket,
                    response,
                )
                return False
        except ClientError:
            logger.exception("Could not delete %s from %s", object_key, bucket)
            return False

    ## TODO check if removing folder name will pose issues for other fucntions
    @staticmethod
    def delete_s3_object_in_folder(folder_name: str, object_name: str) -> bool:
        object_key = f"{folder_name}/{object_name}"
        try:
            response = s3_client.delete_object(Bucket=bucket, Key=object_key)
            if response["ResponseMetadata"]["HTTPStatusCode"] == 204:  # noqa: PLR2004
                return True
            logger.exception(
                "Failed to delete %s from %s. Response: %s",
                object_key,
                bucket,
                response,
            )
            return False
        except ClientError:
            logger.exception("Could not delete %s from %s", object_key, bucket)
            return False

    @staticmethod
    def delete_s3_object_in_folder_from_path(file_path: str) -> bool:
        bucket_name, key = StorageManager.parse_s3_url(file_path)
        try:
            response = s3_client.delete_object(Bucket=bucket_name, Key=key)
            if response["ResponseMetadata"]["HTTPStatusCode"] == 204:  # noqa: PLR2004
                return True
            logger.exception(
                "Failed to delete from %s. Response: %s",
                bucket,
                response,
            )
            return False
        except ClientError:
            logger.exception("Could not delete  from %s", bucket)
            return False

    @staticmethod
    def allowed_img_file(filename: str) -> bool:
        return "." in filename and filename.rsplit(".", 1)[1].lower() in settings.allowed.images

    @staticmethod
    def parse_s3_url(url: str) -> tuple[str, str]:
        """Parse the S3 URL into bucket name and key."""
        parsed_url = urlparse(url)
        # Remove the domain check or modify it to work with your expected MinIO URL
        # For example, if your MinIO URL doesnt include "amazonaws.com", skip that check.
        bucket_name = (
            settings.aws.bucket
        )  # or extract it from a known position if your URL format is consistent
        key = parsed_url.path.lstrip("/")
        logger.debug("Parsed S3 URL: %s", parsed_url)
        logger.debug("Bucket name: %s", bucket_name)
        logger.debug("Key: %s", key)
        return bucket_name, key

    # @staticmethod
    # def parse_s3_url(url: str) -> tuple[str, str]:
    #     """Parse the S3 URL into bucket name and key.

    #     :param url: The full URL to an S3 object
    #     :return: bucket name and key
    #     """
    #     parsed_url = urlparse(url)
    #     if not parsed_url.netloc.endswith("amazonaws.com"):
    #         msg = "URL does not belong to amazonaws.com"
    #         raise ValueError(msg)

    #     bucket_name = parsed_url.netloc.split(".")[0]
    #     key = parsed_url.path.lstrip("/")

    #     return bucket_name, key
