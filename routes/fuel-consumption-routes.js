export default function routes(fuelConsumption){
    const descriptionFormat = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
    const regFormat = /^(CA|CY|CF|CAA) \d{3}-\d{3}$/;

    // Helper functions
    function titleCase(str) {
        //keep track of the original string passed
        const originalStr = str;
        const regexHyphen = /-/
        str = str.toLowerCase().split(/\s|-/);

        for (var i = 0; i < str.length; i++) {
          str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
        }

        if(regexHyphen.test(originalStr)=== true){
           str = str.join('-')
        }
        else{
            str = str.join(' ');
        }

        return str;
    }

    async function addVehicle(req, res) {
        // const {description, regNumber} = req.body;
        const description = titleCase(req.body.description);
        const regNumber = req.body.regNumber;

        if (!description.trim() && !regNumber.trim()) {
            req.flash('error','Please enter a vehicle description and registration number');
          } else if (!description.trim()) {
            req.flash('error','Description is required');
          } else if (!regNumber.trim()) {
            req.flash('error','Registration number is required');
          } else if (description.trim() && !descriptionFormat.test(description)) {
            req.flash('error','Please enter a valid vehicle description');
          } else if (regNumber.trim() && !regFormat.test(regNumber)) {
            req.flash('error','Invalid registration number. Should be CA, CY, CF, CAA followed by 3 numbers - 3 numbers');
          } else {
            await fuelConsumption.addVehicle({description, regNumber});
            req.flash('success','Vehicle added successfully');
          }        

        // const result  = await fuelConsumption.addVehicle({description, regNumber});
        res.redirect('/');
    }

    async function vehicles(req,res){
        const vehicles = await fuelConsumption.vehicles()
        res.render('home',{
            tabTitle:'Home - Fuel Tracking App',
            pageTitle:'Fuel Tracking App',
            vehicles
        })
    }

    async function vehicle(req, res) {

        const id = req.params.id;

        const vehicle = await fuelConsumption.vehicle(id)
        const refuelData = await fuelConsumption.refuelHistory(id);

        res.render('vehicle',{
            tabTitle:'Vehicle - Fuel Tracking App',
            pageTitle:'Fuel Tracking App',
            vehicle,
            refuelData
        })
    }

    async function refuel(req, res) {
        const vehicleId = req.params.id;
        const liters = req.body.liters;
        const amount = req.body.amount;
        const distance = req.body.odometer;
        const filledUp = req.body.filledUp;

        // const { vehicleId, liters, amount, distance, filledUp } = req.body;
        // console.log(req.body);
        // console.log(vehicleId,liters,amount,distance,filledUp);
        let status = await fuelConsumption.refuel(vehicleId, liters, amount, distance, filledUp);
        console.log(status);
        // res.json(status);
        res.redirect('/vehicle/'+vehicleId);
    }
    
    function viewVehicle(req,res){
        const id = req.params.id;
        res.redirect('/vehicle/'+id);
    }
    
    function home(req,res){
        res.redirect('/');
    }

    return{
        addVehicle,
        viewVehicle,
        vehicle,
        vehicles,
        refuel,
        home
    }
}