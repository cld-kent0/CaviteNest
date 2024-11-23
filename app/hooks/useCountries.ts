const caviteMunicipalities = [
  // Cities
  {
    value: "BCR",
    label: "Bacoor",
    latlng: [14.4545, 120.9403],
    region: "Calabarzon",
  },
  {
    value: "CAV",
    label: "Cavite City",
    latlng: [14.4833, 120.9000],
    region: "Calabarzon",
  },
  {
    value: "DAS",
    label: "Dasmariñas",
    latlng: [14.3294, 120.9367],
    region: "Calabarzon",
  },
  {
    value: "GEN",
    label: "General Trias",
    latlng: [14.3869, 120.8816],
    region: "Calabarzon",
  },
  {
    value: "IMU",
    label: "Imus",
    latlng: [14.4297, 120.9367],
    region: "Calabarzon",
  },
  {
    value: "TRE",
    label: "Trece Martires",
    latlng: [14.2800, 120.8572],
    region: "Calabarzon",
  },
  {
    value: "TAG",
    label: "Tagaytay",
    latlng: [14.1045, 120.9597],
    region: "Calabarzon",
  },
  {
    value: "GENA",
    label: "General Emilio Aguinaldo",
    latlng: [14.1935, 120.8234],
    region: "Calabarzon",
  },
  
  // Municipalities
  {
    value: "ALF",
    label: "Alfonso",
    latlng: [14.1405, 120.8568],
    region: "Calabarzon",
  },
  {
    value: "AMA",
    label: "Amadeo",
    latlng: [14.1700, 120.9067],
    region: "Calabarzon",
  },
  {
    value: "IND",
    label: "Indang",
    latlng: [14.1950, 120.8775],
    region: "Calabarzon",
  },
  {
    value: "MAG",
    label: "Magallanes",
    latlng: [14.2000, 120.7333],
    region: "Calabarzon",
  },
  {
    value: "MAR",
    label: "Maragondon",
    latlng: [14.2747, 120.7395],
    region: "Calabarzon",
  },
  {
    value: "MEN",
    label: "Mendez",
    latlng: [14.1286, 120.9061],
    region: "Calabarzon",
  },
  {
    value: "NAI",
    label: "Naic",
    latlng: [14.3167, 120.7667],
    region: "Calabarzon",
  },
  {
    value: "NOB",
    label: "Noveleta",
    latlng: [14.4333, 120.8833],
    region: "Calabarzon",
  },
  {
    value: "ROS",
    label: "Rosario",
    latlng: [14.4167, 120.8500],
    region: "Calabarzon",
  },
  {
    value: "SIL",
    label: "Silang",
    latlng: [14.2306, 120.9744],
    region: "Calabarzon",
  },
  {
    value: "TAN",
    label: "Tanza",
    latlng: [14.3833, 120.8500],
    region: "Calabarzon",
  },
  {
    value: "TAR",
    label: "Ternate",
    latlng: [14.2889, 120.7006],
    region: "Calabarzon",
  },
  {
    value: "CAR",
    label: "Carmona",
    latlng: [14.3167, 121.0500],
    region: "Calabarzon",
  },
  {
    value: "GENM",
    label: "General Mariano Alvarez",
    latlng: [14.3000, 120.9833],
    region: "Calabarzon",
  },
];

// Map the Cavite municipalities to the required format
const formattedMunicipalities = caviteMunicipalities.map((municipality) => ({
  value: municipality.value,
  label: municipality.label,
  latlng: municipality.latlng,
  region: municipality.region,
}));

const useCaviteMunicipalities = () => {
  const getAll = () => formattedMunicipalities;

  const getByValue = (value: string) => {
    return formattedMunicipalities.find((item) => item.value === value);
  };

  return {
    getAll,
    getByValue,
  };
};

export default useCaviteMunicipalities;
