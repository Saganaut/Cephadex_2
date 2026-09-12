import argparse
import ast
import datetime as dt
import logging
import os
import sys

import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def call_ai_terms_non_async(sys_instruct, user_prompt):
    return openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": sys_instruct},
            {"role": "user", "content": user_prompt},
        ],
    )


def analyze_file(filename):
    now = dt.datetime.now()
    base_filename = os.path.splitext(os.path.basename(filename))[0]
    log_filename = f'code_review_{base_filename}_{now.strftime("%Y_%m_%d_%H_%M_%S")}.txt'
    logging.basicConfig(filename=log_filename, level=logging.INFO)
    with open(filename) as source:
        tree = ast.parse(source.read())

    functions = [node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
    sys_instruct = """You are a professional python developer reviewing a codebase for a client.
    You are tasked with reviewing the codebase for errors and making suggestions for improvement.
    The codebase uses flask, mysql and sqlalchemy."""
    for function in functions:
        try:
            function_code = ast.unparse(function)
            user_prompt = """Review the following function and make suggestions for improvement.
            Return your response as a JSON object in the following format: {'name':
            'name of the function',
            'pep8_conformity': 'yes', 'error_handling': 'yes', 'function_summary':
            'This function does X','improvement_suggestions':
            'This function could be improved by doing Y'} The function:"""

            user_prompt += function_code
            response = call_ai_terms_non_async(sys_instruct, user_prompt)
            logging.info("========================================")
            logging.info("Function: %s", function.name)
            logging.info(response["choices"][0]["message"]["content"].strip())
        except Exception:
            logging.exception("Error in function: %s", function.name)


# replace 'your_file.py' with the actual Python file path you want to analyze
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analyze a Python file.")
    parser.add_argument(
        "--filename",
        type=str,
        help="Path of the Python file to analyze.",
    )
    args = parser.parse_args()

    if args.filename:
        analyze_file(args.filename)
    else:
        logging.error(
            "No filename provided. Use --filename to specify the Python file to analyze.",
        )
        sys.exit(1)
