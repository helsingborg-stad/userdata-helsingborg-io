exports.seed = knex => knex('users').del()
  .then(() => knex('users')
    .insert([
      {
        person_nr: '195809262743',
        first_name: 'Ylva',
        last_name: 'Jansson',
        email: null,
        device_id: null,
        telephone_nr: null,
        post_nr: '13239',
        post_ort: 'SALTSJÖ-BOO',
        adress: 'ÅKERVÄGEN 5',
      },
      {
        person_nr: '195003042222',
        first_name: 'Stella Ann',
        last_name: 'Vaan Den Dubois',
        email: null,
        device_id: null,
        telephone_nr: null,
        post_nr: '98129',
        post_ort: 'KIRUNA',
        adress: 'KATTUVUOMA 2',
      },
      {
        person_nr: '194106177753',
        first_name: 'Sune',
        last_name: 'Nilsson',
        email: null,
        device_id: null,
        telephone_nr: null,
        post_nr: '17838',
        post_ort: 'EKERÖ',
        adress: 'PENSÉVÄGEN 2',
      },
    ]));
