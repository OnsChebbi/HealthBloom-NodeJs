const Appointment = require("../models/AppointmentModel");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

// @desc    Set appointment
// @route   POST /api/appointments
// @access  Private
exports.setAppoitment = async (req, res) => {
    const {
        title,
        _doctor,
        _patient,
        startDate,
        endDate,
        rRule,
        exDate,
        allDay,
        roomId,
        members,
    } = req.body;

    if (!title || !_doctor || !_patient || !startDate || !endDate) {
        res.status(400);
        throw new Error("Please add all fields");
    }
    //check for doctor
    const doctor = await Doctor.findById(_doctor);

    if (!doctor) {
        res.status(400);
        throw new Error("Doctor not found");
    }
    console.log(req.body);
    //check for doctor
    const patient = await User.findById(_patient).populate("_patient").exec();

    if (!patient) {
        res.status(400);
        throw new Error("patient not found");
    }

    // Create appointment
    const appointment = await Appointment.create({
        title,
        _doctor,
        _patient,
        startDate,
        endDate,
        rRule,
        exDate,
        allDay,
        roomId,
        members,
    });

    if (appointment) {
        doctor.Appointments.push(appointment);
        patient._patient.Appointments.push(appointment);
        await doctor.save();
        await patient.save();
        await res.status(201).json(appointment);
    } else {
        res.status(400);
        throw new Error("appointment not created");
    }
};

// @desc    Get appointment
// @route   Get /api/appointments
// @access  Private
exports.getAppoitments = async (req, res) => {
    const doctor_id = req.params.id;
    if (!doctor_id) {
        req.status(400);
        throw new Error("enter doctor id");
    }
    const doctor = Doctor.findById(doctor_id);
    if (!doctor) {
        req.status(400);
        throw new Error("doctor not found");
    }
    const appoinments = await Appointment.find({ _doctor: doctor_id });
    res.status(200).json(appoinments);
};
exports.editAppointment = async (req, res) => {
    const appointment = await Appointment.findByIdAndUpdate(
        { _id: req.params.id },
        req.body
    );
    res.status(200).json(appointment);
};

exports.deleteAppointment = async (req, res) => {
    Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "successfully deleted" });
};