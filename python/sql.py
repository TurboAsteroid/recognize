import pymysql.cursors

# Connect to the database
connection = pymysql.connect(host='10.1.255.117',
                             user='lvo',
                             password='vo324adHHG',
                             db='gsm_db',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

try:
    with connection.cursor() as cursor:
        # Read a single record
        sql = "select * from gsm_db.cards join gsm_db.search on cards.emp_id = search.emp_id where cards.emp_id = %s  limit 1"
        cursor.execute(sql, (10))
        result = cursor.fetchone()
        print(result)
finally:
    connection.close()