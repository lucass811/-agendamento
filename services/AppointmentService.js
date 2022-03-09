const appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const AppointmentFactory = require("../factories/AppointmentFactory");
const mailer = require("nodemailer");

const Appo = mongoose.model("Appointment", appointment);

class AppointmentService {
    async Create(name, email, description, cpf, date, time){
        let newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finished: false,
            notified: false
        });
        try {
            await newAppo.save();
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
       
    } 

    async GetAll(showFinished){
        if(showFinished){
           return await Appo.find();
        }else{
            let appos = await Appo.find({'finished': false});
            let appointments = [];

            appos.forEach(appointment => {
                if(appointment.date != undefined){
                    appointments.push(AppointmentFactory.Build(appointment))
                }

            });

            return appointments;
        }
    }

    async GetById(id){
        try {
            let event = await Appo.findOne({'_id': id});
            return event;
        } catch (err) {
            console.log(err);
        }
      
    }
    async Finish(id){
        try {
            await Appo.findByIdAndUpdate(id,{finished: true});
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }    
    async Search(query){
        try {
            let appos= await Appo.find().or([{email: query},{cpf: query}])
            return appos;
        } catch (err) {
            console.log(err);
            return [];
        }
        
       
    }
    async SendNotification(){
        
       let appos = await this.GetAll(false);

       let transporter = mailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 25,
        auth: {
            user: "2c89458caef4",
            pass: "64821cb3"
        }
        });
        appos.forEach(async app => {

            let date = app.start.getTime();
            let hour = 1000 * 60 * 60;

            let gap = date-Date.now();

            if(gap <= hour){

                if(!app.notified){
                   await Appo.findByIdAndUpdate(app.id,{notified: true});
                   transporter.sendMail({
                       from: "Lucas Silva <teste@teste>",
                       to: app.email,
                       subject: "Sua consulta vai acontecer em breve!",
                       text: "Sua consulta vai acontecer em menos de 1h"
                   }).then( () => {

                   }).catch(err => {

                   });
                }
            }


       });
    }
    
}

module.exports = new AppointmentService();
