# COMP_4513_Assign1

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
| `/api/eras`                       | Returns all the eras                                                                                |
| `/api/galleries`                  | Returns all the galleries                                                                           |
| `/api/galleries/:id`              | Returns a specific gallery by ID (e.g., `/api/galleries/30`)                                        |
| `/api/galleries/country/:substring` | Returns galleries where the country name starts with the given substring (e.g., `/api/galleries/country/fra`) |
| `/api/artists`                    | Returns all artists                                                                                 |
