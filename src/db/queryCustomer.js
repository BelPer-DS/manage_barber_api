export const queryCustomer = {
    CREATED_CUSTOMER : "insert into customers(name,last_name,alias_name,phone_number, mail, access_code) values(?,?,?,?,?,?);",
    FIND_BY_PHONE_NUMBER : "select id_customer, name, last_name, alias_name, phone_number, mail from customers where phone_number = ?;",
    FIND_ACCESS_CODE : "select access_code, id_customer from customers where phone_number = ?;",
    FIND_BY_ID : "select id_customer, name, last_name, alias_name, phone_number, mail from customers where id_customer = ?;"
} 