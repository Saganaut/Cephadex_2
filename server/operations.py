import argparse

from tools.reporting import Reporter


def main(args):
    if args.report:
        Reporter.create()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the Reporter.")
    parser.add_argument("--report", action="store_true", help="Generate a report")
    args = parser.parse_args()
    main(args)
