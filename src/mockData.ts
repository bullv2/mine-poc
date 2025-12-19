export interface MineLocation {
  id: string;
  name: string;
  type: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  status: 'Active' | 'Maintenance' | 'Incident';
  temperature: number;
  production: {
    current: number;
    target: number;
    unit: string;
  };
  weather: {
    condition: 'Sunny' | 'Cloudy' | 'Rain';
    windSpeed: number;
    temperature: number;
  };
  incidents: Incident[];
}

export interface Incident {
  id: string;
  date: string;
  type: 'Equipment Failure' | 'Structural' | 'Personal Injury' | 'Environmental' | 'Other';
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Resolved';
  description: string;
}

export const mineLocations: MineLocation[] = [
  {
    id: '1',
    name: 'Mount Newman Iron Ore Mine',
    type: 'Iron Ore',
    location: 'Pilbara, Western Australia',
    coordinates: [-23.3631, 119.7375],
    status: 'Active',
    temperature: 42,
    production: {
      current: 85000,
      target: 100000,
      unit: 'tonnes/day'
    },
    weather: {
      condition: 'Sunny',
      windSpeed: 15,
      temperature: 42
    },
    incidents: [
      {
        id: 'inc-1',
        date: '2024-12-18',
        type: 'Equipment Failure',
        severity: 'Medium',
        status: 'Open',
        description: 'Conveyor belt malfunction on Line 3'
      },
      {
        id: 'inc-2',
        date: '2024-12-15',
        type: 'Structural',
        severity: 'Low',
        status: 'Resolved',
        description: 'Minor wall crack in processing facility'
      }
    ]
  },
  {
    id: '2',
    name: 'Carlin Gold Mine',
    type: 'Gold',
    location: 'Nevada, USA',
    coordinates: [40.7128, -116.0050],
    status: 'Active',
    temperature: 18,
    production: {
      current: 1200,
      target: 1500,
      unit: 'oz/day'
    },
    weather: {
      condition: 'Cloudy',
      windSpeed: 8,
      temperature: 18
    },
    incidents: [
      {
        id: 'inc-3',
        date: '2024-12-17',
        type: 'Personal Injury',
        severity: 'High',
        status: 'Open',
        description: 'Worker injury in underground shaft'
      },
      {
        id: 'inc-4',
        date: '2024-12-12',
        type: 'Equipment Failure',
        severity: 'Low',
        status: 'Resolved',
        description: 'Drill rig maintenance completed'
      }
    ]
  },
  {
    id: '3',
    name: 'Escondida Copper Mine',
    type: 'Copper',
    location: 'Atacama Desert, Chile',
    coordinates: [-24.2708, -69.0822],
    status: 'Maintenance',
    temperature: 25,
    production: {
      current: 0,
      target: 200000,
      unit: 'tonnes/day'
    },
    weather: {
      condition: 'Sunny',
      windSpeed: 12,
      temperature: 25
    },
    incidents: [
      {
        id: 'inc-5',
        date: '2024-12-16',
        type: 'Equipment Failure',
        severity: 'High',
        status: 'Open',
        description: 'Major crusher breakdown - scheduled maintenance'
      }
    ]
  },
  {
    id: '4',
    name: 'Grasberg Gold Mine',
    type: 'Gold & Copper',
    location: 'Papua, Indonesia',
    coordinates: [-4.0531, 137.1164],
    status: 'Incident',
    temperature: 28,
    production: {
      current: 45000,
      target: 60000,
      unit: 'tonnes/day'
    },
    weather: {
      condition: 'Rain',
      windSpeed: 20,
      temperature: 28
    },
    incidents: [
      {
        id: 'inc-6',
        date: '2024-12-19',
        type: 'Environmental',
        severity: 'High',
        status: 'Open',
        description: 'Water management system alert - heavy rainfall'
      },
      {
        id: 'inc-7',
        date: '2024-12-14',
        type: 'Structural',
        severity: 'Medium',
        status: 'Open',
        description: 'Slope stability monitoring alert'
      }
    ]
  },
  {
    id: '5',
    name: 'Kiruna Iron Ore Mine',
    type: 'Iron Ore',
    location: 'Kiruna, Sweden',
    coordinates: [67.8558, 20.2253],
    status: 'Active',
    temperature: -8,
    production: {
      current: 95000,
      target: 95000,
      unit: 'tonnes/day'
    },
    weather: {
      condition: 'Cloudy',
      windSpeed: 10,
      temperature: -8
    },
    incidents: [
      {
        id: 'inc-8',
        date: '2024-12-13',
        type: 'Equipment Failure',
        severity: 'Low',
        status: 'Resolved',
        description: 'Heating system maintenance completed'
      }
    ]
  },
  {
    id: '6',
    name: 'Olympic Dam Mine',
    type: 'Copper, Gold, Uranium',
    location: 'South Australia, Australia',
    coordinates: [-30.4344, 136.8853],
    status: 'Active',
    temperature: 35,
    production: {
      current: 180000,
      target: 200000,
      unit: 'tonnes/day'
    },
    weather: {
      condition: 'Sunny',
      windSpeed: 18,
      temperature: 35
    },
    incidents: [
      {
        id: 'inc-9',
        date: '2024-12-11',
        type: 'Other',
        severity: 'Low',
        status: 'Resolved',
        description: 'Routine safety inspection completed'
      }
    ]
  }
];

// Helper function to get all incidents
export const getAllIncidents = (): Incident[] => {
  return mineLocations.flatMap(mine => 
    mine.incidents.map(incident => ({
      ...incident,
      mineName: mine.name,
      mineLocation: mine.location
    }))
  );
};

// Helper function to get 7-day trend data
export const getTrendData = (mineId: string) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    incidents: Math.floor(Math.random() * 5) + (mineId === '4' ? 2 : 0), // More incidents for mine 4
    severity: Math.floor(Math.random() * 3)
  }));
};
