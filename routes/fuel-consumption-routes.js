export default function routes(fuelConsumption){
    const regex = /^[a-zA-Z]+$/;
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
        console.log(regex.test(description))
        console.log(req.body);

        if(regex.test(description)){

        }
        else{
            req.flash('error','Please enter a vehicle description')
        }

        const result  = await fuelConsumption.addVehicle({description, regNumber});
        res.render('home',{

        });
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
        res.render('vehicle',{
            tabTitle:'Vehicle - Fuel Tracking App',
            pageTitle:'Fuel Tracking App',
            vehicle
        })
    }

    async function refuel(req, res) {
        
        const { vehicleId, liters, amount, distance, filledUp } = req.body;
        console.log(req.body);
        
        const status = await fuelConsumption.refuel(vehicleId, liters, amount, distance, filledUp)
        res.json(status);

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