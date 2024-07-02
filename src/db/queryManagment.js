export const queryManagment = {
    CREATED_EMPLOYEE : "insert into employees(name,id_account,last_name,role,phone_number,mail,status) values (?,?,?,?,?,?,?);",
    CREATED_ACCESS : "insert into access(id_employee, access_code, token, status) values(?,?,?,?);",
    FIND_BY_ACCOUNT_ID : "select id_account, name, last_name, role, phone_number, mail, status from employees where id_account = ?;",
    FIND_ACCESS_CODE : "select em.id_employee, ac.access_code from employees as em inner join access as ac on em.id_employee = ac.id_employee where em.id_account = ?;",
    FIND_EMPLOYEES : "select id_account, name, last_name, role, phone_number, mail, status from employees;"
}