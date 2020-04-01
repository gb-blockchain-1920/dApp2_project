# Hyperledger Fabric + Aircraft MRO
**A Distributed Applications II Project**  
Aaron Lu - 101278524

### Presentation
https://slides.com/aalu1418/dapp2_project/fullscreen

### Planning
- Hyperledger Fabric (maintenance schedule + parts provenance)
- Express API
- Deployed React front-end
- Status indicator for front-end on connecting to API (see if it's still active)
- Test cases
- CI/CD

### Data
- Aircraft
  - maintenance schedules (type, date, history)
  - parts list
  - flight hours
  - maintenance reports (type, information)
  - owner (name, purchase date, sold date)
- Part
  - current aircraft
  - total hours
  - maximum hours
  - history (aircraft, hours, on date, off date)

### Life Cycle of Airliner
![](./documentation/lifeCycle.png)

### Timeline
![](./documentation/timeline.png)

### Sequence Diagram
![](./documentation/sequenceDiagram.png)

### Resources
- https://www.icao.int/safety/airnavigation/OPS/airworthiness/Pages/EAMR.aspx
- https://en.wikipedia.org/wiki/Aircraft_maintenance_checks
