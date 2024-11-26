const caviteMunicipalities = [
  // Cities
  {
    value: "BCR",
    label: "Bacoor",
    latlng: [14.4545, 120.9403],
    region: "Cavite",
  },
  {
    value: "CAV",
    label: "Cavite City",
    latlng: [14.4833, 120.9000],
    region: "Cavite",
  },
  {
    value: "DAS",
    label: "Dasmariñas",
    latlng: [14.3294, 120.9367],
    region: "Cavite",
  },
  {
    value: "GEN",
    label: "General Trias",
    latlng: [14.3869, 120.8816],
    region: "Cavite",
  },
  {
    value: "IMU",
    label: "Imus",
    latlng: [14.4297, 120.9367],
    region: "Cavite",
  },
  {
    value: "TRE",
    label: "Trece Martires",
    latlng: [14.2800, 120.8572],
    region: "Cavite",
  },
  {
    value: "TAG",
    label: "Tagaytay",
    latlng: [14.1045, 120.9597],
    region: "Cavite",
  },
  {
    value: "GENA",
    label: "General Emilio Aguinaldo",
    latlng: [14.1935, 120.8234],
    region: "Cavite",
  },
  
  // Municipalities
  {
    value: "ALF",
    label: "Alfonso",
    latlng: [14.1405, 120.8568],
    region: "Cavite",
  },
  {
    value: "AMA",
    label: "Amadeo",
    latlng: [14.1700, 120.9067],
    region: "Cavite",
  },
  {
    value: "IND",
    label: "Indang",
    latlng: [14.1950, 120.8775],
    region: "Cavite",
  },
  {
    value: "MAG",
    label: "Magallanes",
    latlng: [14.2000, 120.7333],
    region: "Cavite",
  },
  {
    value: "MAR",
    label: "Maragondon",
    latlng: [14.2747, 120.7395],
    region: "Cavite",
  },
  {
    value: "MEN",
    label: "Mendez",
    latlng: [14.1286, 120.9061],
    region: "Cavite",
  },
  {
    value: "NAI",
    label: "Naic",
    latlng: [14.3167, 120.7667],
    region: "Cavite",
  },
  {
    value: "NOB",
    label: "Noveleta",
    latlng: [14.4333, 120.8833],
    region: "Cavite",
  },
  {
    value: "ROS",
    label: "Rosario",
    latlng: [14.4167, 120.8500],
    region: "Cavite",
  },
  {
    value: "SIL",
    label: "Silang",
    latlng: [14.2306, 120.9744],
    region: "Cavite",
  },
  {
    value: "TAN",
    label: "Tanza",
    latlng: [14.3833, 120.8500],
    region: "Cavite",
  },
  {
    value: "TAR",
    label: "Ternate",
    latlng: [14.2889, 120.7006],
    region: "Cavite",
  },
  {
    value: "CAR",
    label: "Carmona",
    latlng: [14.3167, 121.0500],
    region: "Cavite",
  },
  {
    value: "GENM",
    label: "General Mariano Alvarez",
    latlng: [14.3000, 120.9833],
    region: "Cavite",
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
