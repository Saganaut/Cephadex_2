import logging
from typing import List

import boto3
from botocore.exceptions import ClientError

from dependencies.settings import get_settings

logger = logging.getLogger("App")
settings = get_settings()


def setup_s3_buckets() -> None:
    """Initialize S3/MinIO buckets required by the application."""
    required_buckets = [
        settings.aws.bucket,  # Main bucket (cephadex-dev)
    ]
    
    logger.info(f"Initializing S3/MinIO buckets: {required_buckets}")
    
    try:
        # Create S3 client
        s3_client = boto3.client(
            "s3",
            endpoint_url=settings.aws.s3_uri,
            aws_access_key_id=settings.aws.access_key,
            aws_secret_access_key=settings.aws.secret_access_key,
            region_name=settings.aws.default_region,
        )
        
        # Get list of existing buckets
        try:
            existing_buckets_response = s3_client.list_buckets()
            existing_buckets = [bucket["Name"] for bucket in existing_buckets_response.get("Buckets", [])]
            logger.debug(f"Existing buckets: {existing_buckets}")
        except ClientError as e:
            logger.warning(f"Could not list existing buckets: {e}")
            existing_buckets = []
        
        # Create missing buckets
        for bucket_name in required_buckets:
            if bucket_name not in existing_buckets:
                try:
                    logger.info(f"Creating bucket: {bucket_name}")
                    s3_client.create_bucket(Bucket=bucket_name)
                    logger.info(f"Successfully created bucket: {bucket_name}")
                except ClientError as e:
                    error_code = e.response.get("Error", {}).get("Code", "Unknown")
                    if error_code == "BucketAlreadyExists":
                        logger.info(f"Bucket {bucket_name} already exists")
                    elif error_code == "BucketAlreadyOwnedByYou":
                        logger.info(f"Bucket {bucket_name} already owned by you")
                    else:
                        logger.error(f"Failed to create bucket {bucket_name}: {e}")
                        raise
            else:
                logger.info(f"Bucket {bucket_name} already exists")
                
        logger.info("S3/MinIO bucket initialization completed successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize S3/MinIO buckets: {e}")
        # Don't raise the exception to avoid breaking application startup
        # The application should still start even if bucket creation fails
        logger.warning("Application will continue without bucket initialization")


async def async_setup_s3_buckets() -> None:
    """Async wrapper for S3 bucket setup."""
    setup_s3_buckets()