export const queryCustomer = {
    CREATED_CUSTOMER : "insert into customers(name,last_name,alias_name,phone_number, mail, access_code, img_qr) values(?,?,?,?,?,?,?);",
    FIND_BY_PHONE_NUMBER : "select id_customer, name, last_name, alias_name, phone_number, mail from customers where phone_number = ?;",
    FIND_ACCESS_CODE : "select access_code, id_customer from customers where phone_number = ?;",
    FIND_BY_ID : "select id_customer, name, last_name, alias_name, phone_number, mail from customers where id_customer = ?;",
    CREATED_QR_IMG : "insert into images(title, type, path, status) values (?,?,?,?);",
    FIND_QR_IMG : "select path from images where id_image = ?;"
} 