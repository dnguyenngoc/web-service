import datetime


def is_string_time(value, format = '%Y-%m-%d'):
    try:
        datetime.datetime.strptime(value, format)
        return True
    except ValueError:
        return False

    
def string_to_datetime(value, format):
    return datetime.strptime(value, format)