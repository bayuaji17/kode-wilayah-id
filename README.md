# Kode Wilayah Indonesia API

A high-performance REST API for Indonesian administrative region codes (provinces, regencies, districts, villages) based on Permendagri 72/2019. Built with ElysiaJS and Bun.

## Features

- **Fast**: Built on Bun runtime with ElysiaJS framework
- **Type-safe**: Full TypeScript support with TypeBox validation
- **Cached Responses**: 7-day cache headers for optimal performance
- **OpenAPI Documentation**: Auto-generated API docs at `/openapi`
- **Structured Logging**: Request logging with Logixlysia
- **CORS Enabled**: Cross-origin support out of the box

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/provinces` | Get all 34 provinces |
| GET | `/regencies/:province_id` | Get regencies by province |
| GET | `/districts/:regency_id` | Get districts by regency |
| GET | `/villages/:district_id` | Get villages by district |
| GET | `/openapi` | OpenAPI documentation |

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

Server runs at `http://localhost:3000`

## API Usage

### Get All Provinces

```bash
curl http://localhost:3000/provinces
```

Response:
```json
{
  "success": true,
  "data": [
    { "code": "11", "name": "ACEH" },
    { "code": "12", "name": "SUMATERA UTARA" }
  ],
  "count": 34
}
```

### Get Regencies by Province

```bash
curl http://localhost:3000/regencies/11
```

Response:
```json
{
  "success": true,
  "data": [
    { "code": "11.01", "name": "KAB. ACEH SELATAN", "province_code": "11" },
    { "code": "11.02", "name": "KAB. ACEH TENGGARA", "province_code": "11" }
  ],
  "count": 23
}
```

### Get Districts by Regency

```bash
curl http://localhost:3000/districts/11.01
```

### Get Villages by District

```bash
curl http://localhost:3000/villages/11.01.01
```

## Code Format

Administrative codes follow the format:

| Level | Format | Example |
|-------|--------|---------|
| Province | `XX` | `11` (Aceh) |
| Regency | `XX.XX` | `11.01` (Aceh Selatan) |
| District | `XX.XX.XX` | `11.01.01` (Bakongan) |
| Village | `XX.XX.XX.XXXX` | `11.01.01.2001` (Keude Bakongan) |

## Project Structure

```
src/
├── index.ts                 # Application entry point
├── modules/
│   └── region/
│       ├── index.ts         # Region routes (controller)
│       ├── service.ts       # Business logic
│       └── model.ts         # TypeBox schemas & types
└── plugins/
    ├── cors.ts              # CORS configuration
    └── logger.ts            # Logixlysia logger setup
```

## Response Caching

All region endpoints return `Cache-Control: public, max-age=604800, immutable` headers (7 days). This is appropriate since administrative regions rarely change.

## Data Source

- CSV data from [kodewilayah.id](https://kodewilayah.id/)

## Tech Stack

- [Bun](https://bun.sh/) - JavaScript runtime
- [ElysiaJS](https://elysiajs.com/) - TypeScript web framework
- [TypeBox](https://sinclairzx81.github.io/typebox/) - Runtime type validation
- [Logixlysia](https://logixlysia.vercel.app/) - Structured logging
- [OpenAPI](https://swagger.io/specification/) - API documentation

## License

MIT
