export const queryCompany = {
    CREATED_COMPANY : "insert into companies(name,owner,status) value(?,?,?);",
    FIND_ID_EMPLOYEE : "select id_employee from employees where id_account = ?;",
    CREATED_SUBSIDIARY : "insert into subsidiaries(name, location, phone_number_1, phone_number_2, phone_number_3,id_company,status) values(?,?,?,?,?,?,?);",
    FIND_COMPANY_BY_OWNER : "select co.id_company, co.name, co.status from companies as co inner join employees as em on co.owner = em.id_employee where em.id_account = ?;",
    FIND_SUBSIDIARIES_BY_COMPANY : "select id_subsidiary, name, location, phone_number_1, phone_number_2, phone_number_3, status from subsidiaries where id_company = ?;"
}