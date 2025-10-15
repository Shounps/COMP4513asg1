const express = require('express');
const supa = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supaUrl = process.env.SUPABASE_URL;
const supaAnonKey = process.env.SUPABASE_KEY;
const supabase = supa.createClient(supaUrl, supaAnonKey);


app.get('/', (req, res) => {
    res.send('Formula 1 API is running !');
});

// =========================================================
// 1) /api/circuits - Returns all circuits
// =========================================================
app.get('/api/circuits', async (req, res) => {
    const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .order('name', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// =========================================================
// 2) /api/circuits/:ref - Returns the specified circuit
// =========================================================
app.get('/api/circuits/:ref', async (req, res) => {
    const { ref } = req.params;
    const { data, error } = await supabase
        .from('circuits')
        .select('*')
        .ilike('circuitRef', ref)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return res.status(404).json({ error: `Circuit with ref '${ref}' not found.` });
        }
        return res.status(500).json({ error: error.message });
    }
    if (!data) {
        return res.status(404).json({ error: `Circuit with ref '${ref}' not found.` });
    }
    res.json(data);
});

// =========================================================
// 3) /api/circuits/season/:year - Circuits used in a season
// =========================================================
app.get('/api/circuits/season/:year', async (req, res) => {
    const { year } = req.params;

    const yearInt = parseInt(year);
    if (isNaN(yearInt) || year.length !== 4 || yearInt < 1950 || yearInt > new Date().getFullYear() + 1) {
        return res.status(400).json({
            error: `Invalid year format or range. Please provide a valid 4-digit year (e.g., 2024). Received: ${year}`
        });
    }

    try {
        const { data, error } = await supabase
            .from('races')
            .select(`
        round,
        year,
        circuitId,
        circuits (name, location, country)
      `)
            .eq('year', year)
            .order('round', { ascending: true });

        if (error) throw error;

        // If data is an empty array, return it (means no races for that year)
        if (data.length === 0) {
            return res.json([]);
        }

        const circuits = data.map(r => ({
            round: r.round,
            year: r.year,
            circuitId: r.circuitId,
            name: r.circuits?.name,
            location: r.circuits?.location,
            country: r.circuits?.country
        }));

        res.json(circuits);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch circuits for the season' });
    }
});

// =========================================================
// 4) /api/constructors - Returns all constructors
// =========================================================
app.get('/api/constructors', async (req, res) => {
    const { data, error } = await supabase
        .from('constructors')
        .select('*')
        .order('name', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// =========================================================
// 5) /api/constructors/:ref - Returns specific constructor
// =========================================================
app.get('/api/constructors/:ref', async (req, res) => {
    const { ref } = req.params;
    const { data, error } = await supabase
        .from('constructors')
        .select('*')
        .ilike('constructorRef', ref)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return res.status(404).json({ error: `Constructor with ref '${ref}' not found.` });
        }
        return res.status(500).json({ error: error.message });
    }
    if (!data) {
        return res.status(404).json({ error: `Constructor with ref '${ref}' not found.` });
    }
    res.json(data);
});

// =========================================================
// 6) /api/drivers - Returns all drivers
// =========================================================
app.get('/api/drivers', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('surname', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// =========================================================
// 7) /api/drivers/:ref - Returns specific driver
// =========================================================
app.get('/api/drivers/:ref', async (req, res) => {
    const { ref } = req.params;
    const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .ilike('driverRef', ref)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return res.status(404).json({ error: `Driver with ref '${ref}' not found.` });
        }
        return res.status(500).json({ error: error.message });
    }
    if (!data) {
        return res.status(404).json({ error: `Driver with ref '${ref}' not found.` });
    }
    res.json(data);
});

// =========================================================
// 8) /api/drivers/search/:substring - Search surname prefix
// =========================================================
app.get('/api/drivers/search/:substring', async (req, res) => {
    const { substring } = req.params;

    try {
        const { data, error } = await supabase
            .from('drivers')
            .select('*')
            .ilike('surname', `${substring}%`)
            .order('surname', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                error: `No drivers found with surname starting with '${substring}'.`
            });
        }

        res.json(data);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: err.message });
    }
});


// =========================================================
// 9) /api/drivers/race/:raceId - Drivers in a given race
// =========================================================

app.get('/api/drivers/race/:raceId', async (req, res) => {
    const { raceId } = req.params;
    const { data, error } = await supabase
        .from('results')
        .select(`
      driverId,
      drivers!inner(forename, surname, nationality),
      position,
      points
    `)
        .eq('raceId', raceId)
        .order('position', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    // Return just the joined driver details + result info
    const formatted = data.map((r) => ({
        ...r.drivers,
        position: r.position,
        points: r.points,
    }));

    res.json(formatted);
});

// =========================================================
// 10) /api/races/:raceId - Returns a specific race
// =========================================================
app.get('/api/races/:raceId', async (req, res) => {
    const { raceId } = req.params;

    const { data, error } = await supabase
        .from('races')
        .select(`
      raceId,
      name,
      round,
      year,
      date,
      circuits!inner (
        name,
        location,
        country
      )
    `)
        .eq('raceId', raceId);

    if (error) return res.status(500).json({ error: error.message });

    if (data.length === 0) {
        return res.status(404).json({ error: `Race with ID '${raceId}' not found.` });
    }

    res.json(data[0]);
});


// =========================================================
// 11) /api/races/season/:year - Returns all races in a season
// =========================================================
app.get('/api/races/season/:year', async (req, res) => {
    const { year } = req.params;

    try {
        const { data, error } = await supabase
            .from('races')
            .select(`
                raceId,
                name,
                round,
                year,
                date,
                circuits!inner (name, location, country)
            `)
            .eq('year', year)
            .order('round', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                error: `No races found for the ${year} season.`
            });
        }

        res.json(data);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: err.message });
    }
});


// =========================================================
// 12) /api/races/season/:year/:round - Returns a specific race by year and round
// =========================================================
app.get('/api/races/season/:year/:round', async (req, res) => {
    const { year, round } = req.params;

    const { data, error } = await supabase
        .from('races')
        .select(`
      raceId,
      name,
      round,
      year,
      date,
      circuits!inner (name, location, country)
    `)
        .eq('year', year)
        .eq('round', round)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return res.status(404).json({ error: `Race for year ${year}, round ${round} not found.` });
        }
        return res.status(500).json({ error: error.message });
    }
    if (!data) {
        return res.status(404).json({ error: `Race for year ${year}, round ${round} not found.` });
    }
    res.json(data);
});


// =========================================================
// 13) /api/races/circuits/:ref - Returns all races at a circuit
// =========================================================
app.get('/api/races/circuits/:ref', async (req, res) => {
    const { ref } = req.params;

    try {
        const { data: circuit, error: circuitError } = await supabase
            .from('circuits')
            .select('circuitId, name, location, country')
            .ilike('circuitRef', ref)
            .single();

        if (circuitError || !circuit) {
            return res.status(404).json({ error: `Circuit with ref '${ref}' not found.` });
        }

        const { data: races, error: racesError } = await supabase
            .from('races')
            .select(`
        raceId,
        name,
        round,
        year,
        date
      `)
            .eq('circuitId', circuit.circuitId)
            .order('year', { ascending: true });

        if (racesError) {
            return res.status(500).json({ error: racesError.message });
        }

        res.json({
            circuit: {
                circuitRef: ref,
                name: circuit.name,
                location: circuit.location,
                country: circuit.country,
            },
            races,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =========================================================
// 14) /api/races/circuits/:ref/season/:start/:end - Returns all the races for a given circuit between two years
// =========================================================
app.get('/api/races/circuits/:ref/season/:start/:end', async (req, res) => {
    const { ref, start, end } = req.params;

    // Return an error if the end year is earlier than the start year.
    if (parseInt(end) < parseInt(start)) {
        return res.status(400).json({ error: 'The end year cannot be earlier than the start year.' });
    }

    try {
        const { data: circuit, error: circuitError } = await supabase
            .from('circuits')
            .select('circuitId, name, location, country')
            .ilike('circuitRef', ref)
            .single();

        if (circuitError || !circuit) {
            return res.status(404).json({ error: `Circuit with ref '${ref}' not found.` });
        }

        const { data: races, error: racesError } = await supabase
            .from('races')
            .select(`
        raceId,
        name,
        round,
        year,
        date
      `)
            .eq('circuitId', circuit.circuitId)
            .gte('year', start)
            .lte('year', end)
            .order('year', { ascending: true });

        if (racesError) {
            return res.status(500).json({ error: racesError.message });
        }

        res.json({
            circuit: {
                circuitRef: ref,
                name: circuit.name,
                location: circuit.location,
                country: circuit.country,
            },
            races,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =========================================================
// 15) /api/results/:raceId - Returns results for a specific race
// =========================================================
app.get('/api/results/:raceId', async (req, res) => {
    const { raceId } = req.params;

    const { data, error } = await supabase
        .from('results')
        .select(`
      position,
      points,
      grid,
      laps,
      time,
      fastestLap,
      rank,
      drivers!inner (driverRef, code, forename, surname),
      races!inner (name, round, year, date),
      constructors!inner (name, constructorRef, nationality)
    `)
        .eq('raceId', raceId)
        .order('grid', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    // If no results, check if the race exists at all.
    if (data.length === 0) {
        const { data: raceCheck } = await supabase.from('races').select('raceId').eq('raceId', raceId);
        if (!raceCheck || raceCheck.length === 0) {
            return res.status(404).json({ error: `Race with ID '${raceId}' not found.` });
        }
    }

    res.json(data);
});

// =========================================================
// 16) /api/results/driver/ref - Returns all the results for a given driver
// =========================================================
app.get("/api/results/driver/:ref", async (req, res) => {
    try {
        const { ref } = req.params;

        const { data, error } = await supabase
            .from('results')
            .select(`
                *,
                drivers!inner()
            `)
            .ilike('drivers.driverRef', ref);

        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                error: `No results found for driverRef '${ref}'.`
            });
        }

        res.json(data);
    } catch (error) {
        console.error("Error fetching driver results:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// =========================================================
// 17) /api/results/drivers/ref/seasons/start/end - Returns all the results for a given driver between two years
// =========================================================

app.get('/api/results/drivers/:ref/seasons/:start/:end', async (req, res) => {
    const { ref, start, end } = req.params;

    // Return an error if the end year is earlier than the start year.
    if (parseInt(end) < parseInt(start)) {
        return res.status(400).json({ error: 'The end year cannot be earlier than the start year.' });
    }

    try {
        const { data, error } = await supabase
            .from('results')
            .select(
                `
                *,
                drivers!inner(),
                races!inner(),
                constructors!inner()
                `,
            )
            .ilike(
                'drivers.driverRef',
                ref,
            )
            .gte('races.year', start)
            .lte('races.year', end)
            .order('races(year)')
        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// =========================================================
// 18) /api/qualifying/raceId - Returns the qualifying results for the specified race
// =========================================================
app.get('/api/qualifying/:raceId', async (req, res) => {
    const { raceId } = req.params;

    try {
        const { data, error } = await supabase
            .from('qualifying')
            .select(
                `
            *,
            drivers!inner(),
            constructors!inner(),
            races!inner()
        `,
            )
            .eq('raceId', raceId)
            .order('position', {
                ascending: true,
            })

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =========================================================
// 19) /api/standings/drivers/raceId - Returns the current season driver standings table for the specified race
// =========================================================
app.get('/api/standings/drivers/:raceId', async (req, res) => {
    const { raceId } = req.params;

    try {
        const { data, error } = await supabase
            .from('driver_standings')
            .select(`
                driverStandingsId,
                driverId,
                position,
                points,
                positionText,
                wins,
                raceId,
                drivers!inner (
                    code,
                    forename,
                    surname,
                    driverRef
                )
            `)
            .eq('raceId', raceId)
            .order('position', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ error: error.message });
        }

        res.json(data);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: err.message });
    }
});

// =========================================================
// 20) /api/standings/constructors/raceId  - Returns the current season constructors standings table for the specified race
// =========================================================
app.get('/api/standings/constructors/:raceId', async (req, res) => {
    const { raceId } = req.params;

    try {
        const { data, error } = await supabase
            .from('constructor_standings')
            .select(`
                constructorStandingsId,
                constructorId,
                position,
                points,
                positionText,
                wins,
                raceId,
                constructors!inner (
                    constructorRef,
                    name,
                    nationality,
                    url
                )
            `)
            .eq('raceId', raceId)
            .order('position', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ error: error.message });
        }

        res.json(data);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: err.message });
    }
});


// =========================================================
// Start Server
// =========================================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:8080`);
});