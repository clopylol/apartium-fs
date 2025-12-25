/**
 * Seed script for vehicle brands and models
 * This script populates the vehicle_brands and vehicle_models tables
 * with the most common brands and models in Turkey
 */

import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import * as schema from 'apartium-shared';

const vehicleBrandsData = [
    "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Toyota", "Honda", 
    "Ford", "Renault", "Peugeot", "Fiat", "Opel", "Hyundai", "Kia",
    "Nissan", "Mazda", "Volvo", "Skoda", "Seat", "Citroen", "Dacia",
    "Chevrolet", "Mitsubishi", "Suzuki", "Mini", "Jaguar", "Land Rover",
    "Porsche", "Tesla", "Alfa Romeo", "Jeep", "Subaru", "Lexus", "Infiniti"
];

const vehicleModelsData: Record<string, string[]> = {
    "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "X1", "X3", "X5", "X7", "iX", "i4"],
    "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "CLA", "CLS", "AMG GT"],
    "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "TT", "R8"],
    "Volkswagen": ["Polo", "Golf", "Passat", "Tiguan", "Touareg", "Jetta", "Arteon", "T-Cross", "T-Roc", "ID.3", "ID.4"],
    "Toyota": ["Corolla", "Camry", "RAV4", "Highlander", "Prius", "Yaris", "C-HR", "Land Cruiser", "Hilux", "Auris"],
    "Honda": ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Fit", "City", "BR-V"],
    "Ford": ["Focus", "Fiesta", "Mondeo", "Kuga", "Edge", "Explorer", "Ranger", "Transit", "Mustang"],
    "Renault": ["Clio", "Megane", "Fluence", "Captur", "Kadjar", "Talisman", "Koleos", "Duster", "Symbol", "Twingo"],
    "Peugeot": ["208", "308", "508", "2008", "3008", "5008", "Partner", "Expert", "Rifter"],
    "Fiat": ["500", "Punto", "Egea", "Tipo", "Doblo", "Panda", "Linea", "Palio", "Albea"],
    "Opel": ["Corsa", "Astra", "Insignia", "Crossland", "Grandland", "Mokka", "Combo", "Vivaro"],
    "Hyundai": ["i20", "i30", "Elantra", "Tucson", "Santa Fe", "Kona", "Accent", "Sonata", "Ioniq", "Palisade"],
    "Kia": ["Rio", "Ceed", "Optima", "Sportage", "Sorento", "Stonic", "Picanto", "Cerato", "Niro", "EV6"],
    "Nissan": ["Micra", "Sentra", "Altima", "Qashqai", "X-Trail", "Pathfinder", "Navara", "Juke", "Leaf"],
    "Mazda": ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-5", "CX-9", "MX-5"],
    "Volvo": ["S60", "S90", "V40", "V60", "V90", "XC40", "XC60", "XC90"],
    "Skoda": ["Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Fabia", "Scala", "Enyaq", "Enyaq iV"],
    "Seat": ["Ibiza", "Leon", "Ateca", "Tarraco", "Arona", "Formentor", "Cupra"],
    "Citroen": ["C3", "C4", "C5", "Berlingo", "Cactus", "C-Elysee", "Jumper"],
    "Dacia": ["Sandero", "Logan", "Duster", "Lodgy", "Dokker", "Spring"],
    "Chevrolet": ["Cruze", "Malibu", "Trax", "Equinox", "Tahoe", "Silverado", "Spark"],
    "Mitsubishi": ["L200", "Outlander", "ASX", "Eclipse Cross", "Pajero", "Space Star"],
    "Suzuki": ["Swift", "Vitara", "S-Cross", "Jimny", "SX4", "Grand Vitara", "Baleno"],
    "Mini": ["Cooper", "Countryman", "Clubman", "Paceman", "Convertible"],
    "Jaguar": ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace"],
    "Land Rover": ["Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Evoque", "Defender"],
    "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Boxster", "Cayman", "Taycan"],
    "Tesla": ["Model 3", "Model S", "Model X", "Model Y"],
    "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "4C"],
    "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade"],
    "Subaru": ["Impreza", "Legacy", "Outback", "Forester", "XV"],
    "Lexus": ["ES", "IS", "LS", "NX", "RX", "GX", "LX", "UX"],
    "Infiniti": ["Q50", "Q60", "QX50", "QX60", "QX80"],
};

async function seedVehicleBrandsAndModels() {
    try {
        console.log('Starting vehicle brands and models seed...');

        // Clear existing data (optional - comment out if you want to keep existing data)
        // await db.delete(schema.vehicleModels);
        // await db.delete(schema.vehicleBrands);

        const brandMap = new Map<string, string>(); // brand name -> brand id

        // Insert brands
        for (const brandName of vehicleBrandsData) {
            const [existingBrand] = await db
                .select()
                .from(schema.vehicleBrands)
                .where(eq(schema.vehicleBrands.name, brandName))
                .limit(1);

            if (existingBrand) {
                brandMap.set(brandName, existingBrand.id);
                console.log(`Brand "${brandName}" already exists, skipping...`);
            } else {
                const [newBrand] = await db
                    .insert(schema.vehicleBrands)
                    .values({ name: brandName })
                    .returning();
                brandMap.set(brandName, newBrand.id);
                console.log(`Inserted brand: ${brandName}`);
            }
        }

        // Insert models
        for (const [brandName, models] of Object.entries(vehicleModelsData)) {
            const brandId = brandMap.get(brandName);
            if (!brandId) {
                console.warn(`Brand "${brandName}" not found, skipping models...`);
                continue;
            }

            for (const modelName of models) {
                const [existingModel] = await db
                    .select()
                    .from(schema.vehicleModels)
                    .where(
                        and(
                            eq(schema.vehicleModels.brandId, brandId),
                            eq(schema.vehicleModels.name, modelName)
                        )
                    )
                    .limit(1);

                if (existingModel) {
                    console.log(`Model "${modelName}" for brand "${brandName}" already exists, skipping...`);
                } else {
                    await db
                        .insert(schema.vehicleModels)
                        .values({ brandId, name: modelName });
                    console.log(`Inserted model: ${brandName} ${modelName}`);
                }
            }
        }

        console.log('Vehicle brands and models seed completed successfully!');
    } catch (error) {
        console.error('Error seeding vehicle brands and models:', error);
        throw error;
    }
}

// Run if called directly
seedVehicleBrandsAndModels()
    .then(() => {
        console.log('Seed completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exit(1);
    });

export { seedVehicleBrandsAndModels };

