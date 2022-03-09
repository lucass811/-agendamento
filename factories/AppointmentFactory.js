class AppointmentFactory{

    Build(simpleAppointments){
        let day = simpleAppointments.date.getDate() +1;
        let month = simpleAppointments.date.getMonth();
        let year = simpleAppointments.date.getFullYear();
        let hour = Number.parseInt(simpleAppointments.time.split(":")[0]);
        let minutes = Number.parseInt(simpleAppointments.time.split(":")[1]);

        let startDate = new Date(year, month, day, hour, minutes, 0, 0);
       


        let appo = {
            id: simpleAppointments._id,
            title: simpleAppointments.name + " - " + simpleAppointments.description,
            start: startDate,
            end: startDate,
            notified: simpleAppointments.notified,
            email: simpleAppointments.email
        }
        return appo;
    }
}

module.exports = new AppointmentFactory();