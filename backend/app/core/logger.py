import functools
import logging
import time
import asyncio

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def log_execution_time(func):
    """A decorator that logs the entry, exit, execution time,

    and any errors of async and sync functions.
    """
    if asyncio.iscoroutinefunction(func):
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.perf_counter()
            logger.info("==> Entering: %s", func.__name__)
            try:
                result = await func(*args, **kwargs)
                elapsed = time.perf_counter() - start_time
                logger.info(f"<== Exiting: {func.__name__} (Took {elapsed:.4f}s)")
                return result
            except Exception as e:
                elapsed = time.perf_counter() - start_time
                logger.error(
                    f"xxx Error in {func.__name__} after {elapsed:.4f}s: {str(e)}",
                    exc_info=True,
                )
                raise
            finally:
                end_time = time.perf_counter()
                execution_time = end_time - start_time
                logger.info(f"Function '{func.__name__}' executed in {execution_time:.4f} seconds")
        return async_wrapper
    else:

        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.perf_counter()
            logger.info("==> Entering: %s", func.__name__)
            try:
                result = func(*args, **kwargs)
                elapsed = time.perf_counter() - start_time
                logger.info(f"<== Exiting: {func.__name__} (Took {elapsed:.4f}s)")
                return result
            except Exception as e:
                elapsed = time.perf_counter() - start_time
                logger.error(
                    f"xxx Error in {func.__name__} after {elapsed:.4f}s: {str(e)}",
                    exc_info=True,
                )
                raise
            finally:
                end_time = time.perf_counter()
                execution_time = end_time - start_time
                logger.info(f"Function '{func.__name__}' executed in {execution_time:.4f} seconds")
        return sync_wrapper