# noqa: ruff
import asyncio
import datetime as dt
import functools
import logging
import time

from dependencies.settings import get_settings

settings = get_settings()
logger = logging.getLogger("App")
logger.setLevel(logging.getLevelName(settings.logging.level))

job_logger = logging.getLogger("job_processing")
job_logger.setLevel(logging.getLevelName(settings.logging.level))

subrollover_logger = logging.getLogger("subrollover")
subrollover_logger.setLevel(logging.getLevelName(settings.logging.level))
## TO DO implement special logger for stripe payments


def log_decorator(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            truncated_args = [
                f"{str(arg)[:settings.logging.debug_arg_length]}..."
                if len(str(arg)) > settings.logging.debug_arg_length
                else arg
                for arg in args
            ]
            truncated_kwargs = {
                k: f"{str(v)[:settings.logging.debug_arg_length]}..."
                if len(str(v)) > settings.logging.debug_arg_length
                else v
                for k, v in kwargs.items()
            }
            logger.info(f"Calling {f.__name__} ...")
            logger.debug(
                f"Entering function {f.__name__} with args: {truncated_args} and kwargs: {truncated_kwargs}",
            )
            result = f(*args, **kwargs)
            truncated_result = (
                f"{str(result)[:settings.logging.debug_arg_length]}..."
                if len(str(result)) > settings.logging.debug_arg_length
                else result
            )
            logger.debug(
                f"Exiting function {f.__name__} with result: {truncated_result}",
            )
            return result
        except Exception as e:
            extra_info = kwargs.get("extra_info", "No extra info provided.")
            logger.error(
                f"Exception occurred in function {f.__name__}. Extra info: {extra_info}",
                exc_info=settings.app.stacktrace,
            )
            raise e
        finally:
            elapsed_time = time.time() - start_time
            logger.debug(f"Function {f.__name__} took {elapsed_time:.4f} seconds")

    async def async_wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            truncated_args = [
                f"{str(arg)[:settings.logging.debug_arg_length]}..."
                if len(str(arg)) > settings.logging.debug_arg_length
                else arg
                for arg in args
            ]
            truncated_kwargs = {
                k: f"{str(v)[:settings.logging.debug_arg_length]}..."
                if len(str(v)) > settings.logging.debug_arg_length
                else v
                for k, v in kwargs.items()
            }
            logger.info(f"Calling {f.__name__} ...")
            logger.debug(
                f"Entering function {f.__name__} with args: {truncated_args} and kwargs: {truncated_kwargs}",
            )
            if asyncio.iscoroutinefunction(f):
                result = await f(*args, **kwargs)
            else:
                result = f(*args, **kwargs)
            truncated_result = (
                f"{str(result)[:settings.logging.debug_arg_length]}..."
                if len(str(result)) > settings.logging.debug_arg_length
                else result
            )
            logger.debug(
                f"Exiting function {f.__name__} with result: {truncated_result}",
            )
            return result
        except Exception as e:
            extra_info = kwargs.get("extra_info", "No extra info provided.")
            logger.error(
                f"Exception occurred in function {f.__name__}. Extra info: {extra_info}",
                exc_info=settings.app.stacktrace,
            )
            raise e
        finally:
            elapsed_time = time.time() - start_time
            logger.debug(f"Function {f.__name__} took {elapsed_time:.4f} seconds")

    if asyncio.iscoroutinefunction(f):
        return async_wrapper
    return wrapper


def job_log_decorator(f):
    @functools.wraps(f)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            # truncated_args = [
            #     f"{str(arg)[:DEBUG_ARG_LENGTH]}..."
            #     if len(str(arg)) > DEBUG_ARG_LENGTH
            #     else arg
            #     for arg in args
            # ]
            # truncated_kwargs = {
            #     k: f"{str(v)[:DEBUG_ARG_LENGTH]}..."
            #     if len(str(v)) > DEBUG_ARG_LENGTH
            #     else v
            #     for k, v in kwargs.items()
            # }
            job_logger.info(f"Calling {f.__name__} ...")
            # job_logger.debug(
            #     f"Entering function {f.__name__} with args: {truncated_args} and kwargs: {truncated_kwargs}"
            # )
            result = await f(*args, **kwargs)
            # truncated_result = (
            #     f"{str(result)[:DEBUG_ARG_LENGTH]}..."
            #     if len(str(result)) > DEBUG_ARG_LENGTH
            #     else result
            # )
            # job_logger.debug(
            #     f"Exiting function {f.__name__} with result: {truncated_result}"
            # )
            return result
        except Exception as e:
            extra_info = kwargs.get("extra_info", "No extra info provided.")
            job_logger.error(
                f"Exception occurred in function {f.__name__}. Extra info: {extra_info}",
                exc_info=settings.app.stacktrace,
            )
            raise e
        finally:
            elapsed_time = time.time() - start_time
            job_logger.debug(f"Function {f.__name__} took {elapsed_time:.4f} seconds")

    return wrapper


def subrollover_log_decorator(f):
    @functools.wraps(f)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            truncated_args = [
                f"{str(arg)[:settings.logging.debug_arg_length]}..."
                if len(str(arg)) > settings.logging.debug_arg_length
                else arg
                for arg in args
            ]
            truncated_kwargs = {
                k: f"{str(v)[:settings.logging.debug_arg_length]}..."
                if len(str(v)) > settings.logging.debug_arg_length
                else v
                for k, v in kwargs.items()
            }
            subrollover_logger.info(
                f"Entering function {f.__name__} with args: {truncated_args} and kwargs: {truncated_kwargs}",
            )
            result = f(*args, **kwargs)
            truncated_result = (
                f"{str(result)[:settings.logging.debug_arg_length]}..."
                if len(str(result)) > settings.logging.debug_arg_length
                else result
            )
            subrollover_logger.info(
                f"Exiting function {f.__name__} with result: {truncated_result}",
            )
            return result
        except Exception as e:
            extra_info = kwargs.get("extra_info", "No extra info provided.")
            subrollover_logger.error(
                f"Exception occurred in function {f.__name__}. Extra info: {extra_info}",
                exc_info=settings.app.stacktrace,
            )
            raise e
        finally:
            elapsed_time = time.time() - start_time
            subrollover_logger.info(
                f"Function {f.__name__} took {elapsed_time:.4f} seconds",
            )

    return wrapper


"""decorators.log_call"""
import inspect
import logging
from functools import wraps

DT_NAIVE = "%Y-%m-%d %I:%M:%S %p"


class LogCall:
    """Log call signature and execution time of decorated function."""

    def __init__(self, logger=None):
        self.logger = logger

    def __call__(self, func):
        if not self.logger:
            logging.basicConfig()
            self.logger = logging.getLogger(func.__module__)
            self.logger.setLevel(logging.INFO)

        @wraps(func)
        def wrapper(*args, **kwargs):
            self.logger.info("ENTERED CALL LOG DECORATOR")
            func_call_args = get_function_call_args(func, *args, **kwargs)
            exec_start = dt.datetime.now()
            result = func(*args, **kwargs)
            exec_finish = dt.datetime.now()
            exec_time = format_timedelta_str(exec_finish - exec_start)
            exec_start_str = exec_start.strftime(DT_NAIVE)
            self.logger.info(f"{exec_start_str} | {func_call_args} | {exec_time}")
            return result

        def get_function_call_args(func, *args, **kwargs):
            """Return a string containing function name and list of all argument names/values."""
            func_args = inspect.signature(func).bind(*args, **kwargs)
            func_args.apply_defaults()
            func_args_str = ", ".join(f"{arg}={val}" for arg, val in func_args.arguments.items())
            return f"{func.__name__}({func_args_str})"

        def format_timedelta_str(td):
            """Convert timedelta to an easy-to-read string value."""
            (milliseconds, microseconds) = divmod(td.microseconds, 1000)
            (minutes, seconds) = divmod(td.seconds, 60)
            (hours, minutes) = divmod(minutes, 60)
            if td.days > 0:
                return f"{td.days}d {hours:.0f}h {minutes:.0f}m {seconds}s"
            if hours > 0:
                return f"{hours:.0f}h {minutes:.0f}m {seconds}s"
            if minutes > 0:
                return f"{minutes:.0f}m {seconds}s"
            if td.seconds > 0:
                return f"{td.seconds}s {milliseconds:.0f}ms"
            if milliseconds > 0:
                return f"{milliseconds}ms"
            return f"{td.microseconds}us"

        return wrapper
