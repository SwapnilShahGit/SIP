export class User {
    
  id: string;
  fname: string;
  lname: string;
  email: string;

  constructor(id?: string, response?: any, fnam?: string, lnam?: string, eml?: string) {
    this.id = id || '' ;
    this.fname = response && response.first_name || fnam || '';
    this.lname = response && response.last_name || lnam || '';
    this.email = response && response.email || eml || '';
  }

}