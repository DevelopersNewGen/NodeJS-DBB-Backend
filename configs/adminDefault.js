import { hash } from "argon2";
import User from "../src/user/user.model.js";

const createDefaultAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: 'ADMIN_ROLE' });

        if (!existingAdmin) {
            const aEmail = 'admin@gmail.com';
            const aPassword = 'ADMINB';
            const aUsername = 'ADMINB';
            const aAccountNumber = 'G AB1 CAGU 0101 0000 0000 0110 0011'; 
            const aMonthlyIncome = 101; 

            const encryptedPassword = await hash(aPassword);

            const aUser = new User({
                name: 'Admin',
                username: aUsername,
                email: aEmail,
                password: encryptedPassword,
                role: 'ADMIN_ROLE',
                dpi: '0000000000000', 
                accountNumber: aAccountNumber,  
                monthlyIncome: aMonthlyIncome, 
                address: '123 Admin St', 
                cellphone: '1234567890', 
                jobName: 'Admin'
            });

            await aUser.save();
            console.log('The default admin has been created successfully');
        } else {
            console.log('There is already an admin in the system, another one will not be created');
        }
    } catch (err) {
        console.error('Error creating default admin:', err);
    }
};

export default createDefaultAdmin;