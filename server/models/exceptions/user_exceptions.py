from models.exceptions.exceptions import MyBaseError


class UserExceptions:
    class InvalidPromoCodeError(MyBaseError):
        def __init__(self, message: str = "This is an invalid promo code"):
            super().__init__(f"{message}")

    class ExpiredPromoCodeError(MyBaseError):
        def __init__(self, message: str = "This promo code is expired"):
            super().__init__(f"{message}")

    class InvalidPromoTypeError(MyBaseError):
        def __init__(self, message: str = "The promo code type is invalid"):
            super().__init__(f"{message}")

    class AlreadyRedeemedPromoCodeError(MyBaseError):
        def __init__(self, message: str = "You have already redeemed this code"):
            super().__init__(f"{message}")
