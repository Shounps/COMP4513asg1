# COMP4513_Assignment1

## Overview

* This repository holds the JavaScript code for Assignment #1 of COMP 4513 at Mount Royal University. The goal of this project was to create a series of web accessible APIs using Node, Express and Supabase to interact with a database containing Formula 1 car racing data.

## Built Using

![Node.js](https://img.shields.io/badge/Node.js-22.12.0-red)
![Express](https://img.shields.io/badge/Express-4.21.2-orange)
![Supabase.js](https://img.shields.io/badge/Supabase.js-2.48.1-green)
![Render](https://img.shields.io/badge/Deployed%20on-Render.com-blue)

## API Endpoints

| API Endpoint                      | Description                                                                                         |
| :-------------------------------- | :-------------------------------------------------------------------------------------------------- |
| `/api/circuits`                       | Returns all circuits                                                                            |
| `/api/circuits/:ref`                  | Returns the specified circuit                                                                   |
| `/api/circuits/season/:year`              | Returns Circuits used in a season                                                           |
| `/api/constructors` | Returns all constructors                                                                                          |
| `/api/constructors/:ref`                    | Returns specific constructor                                                              |
| `/api/drivers`                       | Returns all drivers                                                                              |
| `/api/drivers/:ref`                       | Returns specific driver                                                                     |
| `/api/drivers/search/:substring`                       | Returns surname prefix                                                         |
| `/api/drivers/race/:raceId`                       | Returns Drivers in a given race                                                     |
| `/api/races/:raceId`                       | Returns a specific race by ID                                                              |
| `/api/races/season/:year`                       | Returns all races in a season                                                         |
| `/api/races/season/:year/:round`                       | Returns a specific race by year and round                                      |
| `/api/races/circuits/:ref`                       | Returns all races for a given circuit                                                |
| `/api/races/circuits/:ref/season/:start/:end`                       | Returns all the races for a given circuit between two years       |
| `/api/results/:raceId`                       | Returns results for a specific race ID                                                   |
| `/api/results/driver/ref`                       | Returns all the results for a given driver                                            |
| `/api/results/drivers/ref/seasons/start/end`                       | Returns all the results for a given driver between two years       |
| `/api/qualifying/raceId`                       | Returns the qualifying results for the specified race                                  |
| `/api/standings/drivers/raceId`                       | Returns the current season driver standings table for the specified race        |
| `/api/standings/constructors/raceId`            | Returns the current season constructors standings table for the specified race        |

## Test Links

- [/api/circuits](https://comp4513-asg1-s2mk.onrender.com/api/circuits)
- [/api/circuits/monza](https://comp4513-asg1-s2mk.onrender.com/api/circuits/monza)
- [/api/circuits/calgary](https://comp4513-asg1-s2mk.onrender.com/api/circuits/calgary)
- [/api/constructors](https://comp4513-asg1-s2mk.onrender.com/api/constructors)
- [/api/constructors/ferrari](https://comp4513-asg1-s2mk.onrender.com/api/constructors/ferrari)
- [/api/drivers](https://comp4513-asg1-s2mk.onrender.com/api/drivers)
- [/api/drivers/Norris](https://comp4513-asg1-s2mk.onrender.com/api/drivers/Norris)
- [/api/drivers/norris](https://comp4513-asg1-s2mk.onrender.com/api/drivers/norris)
- [/api/drivers/connolly](https://comp4513-asg1-s2mk.onrender.com/api/drivers/connolly)
- [/api/drivers/search/sch](https://comp4513-asg1-s2mk.onrender.com/api/drivers/search/sch)
- [/api/drivers/search/xxxxx](https://comp4513-asg1-s2mk.onrender.com/api/drivers/search/xxxxx)
- [/api/drivers/race/1069](https://comp4513-asg1-s2mk.onrender.com/api/drivers/race/1069)
- [/api/races/1034](https://comp4513-asg1-s2mk.onrender.com/api/races/1034)
- [/api/races/season/2021](https://comp4513-asg1-s2mk.onrender.com/api/races/season/2021)
- [/api/races/season/1800](https://comp4513-asg1-s2mk.onrender.com/api/races/season/1800)
- [/api/races/season/2020/5](https://comp4513-asg1-s2mk.onrender.com/api/races/season/2020/5)
- [/api/races/season/2020/100](https://comp4513-asg1-s2mk.onrender.com/api/races/season/2020/100)
- [/api/races/circuits/7](https://comp4513-asg1-s2mk.onrender.com/api/races/circuits/7)
- [/api/races/circuits/7/season/2015/2022](https://comp4513-asg1-s2mk.onrender.com/api/races/circuits/7/season/2015/2022)
- [/api/races/circuits/7/season/2022/2022](https://comp4513-asg1-s2mk.onrender.com/api/races/circuits/7/season/2022/2022)
- [/api/results/1106](https://comp4513-asg1-s2mk.onrender.com/api/results/1106)
- [/api/results/driver/max_verstappen](https://comp4513-asg1-s2mk.onrender.com/api/results/driver/max_verstappen)
- [/api/results/driver/connolly](https://comp4513-asg1-s2mk.onrender.com/api/results/driver/connolly)
- [/api/results/drivers/sainz/seasons/2021/2022](https://comp4513-asg1-s2mk.onrender.com/api/results/drivers/sainz/seasons/2021/2022)
- [/api/results/drivers/sainz/seasons/2035/2022](https://comp4513-asg1-s2mk.onrender.com/api/results/drivers/sainz/seasons/2035/2022)
- [/api/qualifying/1106](https://comp4513-asg1-s2mk.onrender.com/api/qualifying/1106)
- [/api/standings/drivers/1120](https://comp4513-asg1-s2mk.onrender.com/api/standings/drivers/1120)
- [/api/standings/constructors/1120](https://comp4513-asg1-s2mk.onrender.com/api/standings/constructors/1120)
- [/api/standings/constructors/asds](https://comp4513-asg1-s2mk.onrender.com/api/standings/constructors/asds)
