import datetime


def is_string_time(value, format = '%Y-%m-%d'):
    try:
        datetime.datetime.strptime(value, format)
        return True
    except ValueError:
        return False

    
def string_to_datetime(value, format):
    return datetime.strptime(value, format)


def utc_now_string():
    return str(datetime.datetime.utcnow())


def utc_now():
    return datetime.datetime.utcnow()

def year_month_day_utc_string(space = '-'):
    date = datetime.datetime.utcnow()
    year = str(date.year)
    month = date.month
    if month < 10: month = '0' + str(month)
    day = date.day
    if day < 10: day = '0' + str(day)
    end = '{year}{space}{month}{space}{day}'.format(year = year, month = month, day = day, space = space)
    return end
