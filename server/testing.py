import os

import boto3
from botocore.client import Config

s3_client = boto3.client(
    "s3",
    aws_access_key_id="minioadmin",
    aws_secret_access_key="minioadmin",
    endpoint_url="http://localhost:9002",  # should be http://minio:9000 inside Docker
    region_name="eu-north-1",
    config=Config(signature_version="s3v4"),
)


def try_aws():
    try:
        response = s3_client.list_buckets()
        print("Buckets:", response.get("Buckets", []), flush=True)
    except Exception as e:
        print("Error:", e, flush=True)


if __name__ == "__main__":
    print("herehere", flush=True)
    try_aws()
