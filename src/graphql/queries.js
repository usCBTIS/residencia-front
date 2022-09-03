import { gql } from "@apollo/client";

export const GET_ME_DATA = gql`
  {
    me {
      id
      username
      email
      confirmed
      blocked
      role {
        id
        name
      }
    }
  }
`;

export const GET_ASPIRANT_DATA = gql`
  query GET_ASPIRANT_DATA($ID: ID!) {
    usersPermissionsUser(id: $ID) {
      data {
        id
        attributes {
          username
          name
          firstLastName
          secondLastName
          email
          curp
          birthday
          phone
          gender
          aspirant {
            data {
              id
              attributes {
                statusRequest
                schoolProcedence
                address {
                  data {
                    id
                    attributes {
                      street
                      number
                      municipality
                      zipCode
                      suburb
                    }
                  }
                }
                specialtyOption {
                  data {
                    id
                    attributes {
                      specialty {
                        data {
                          id
                          attributes {
                            description
                          }
                        }
                      }
                    }
                  }
                }
                document {
                  data {
                    id
                    attributes {
                      photo {
                        data {
                          id
                          attributes {
                            url
                          }
                        }
                      }
                      certificate {
                        data {
                          id
                          attributes {
                            url
                          }
                        }
                      }
                      curp {
                        data {
                          id
                          attributes {
                            url
                          }
                        }
                      }
                      birthCertificate {
                        data {
                          id
                          attributes {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SPECIALTIES = gql`
  {
    specialties {
      data {
        value: id
        attributes {
          label: description
        }
      }
    }
  }
`;

export const GET_LIST_ASPIRANTS = gql`
  {
    aspirants {
      data {
        id
        attributes {
          user {
            data {
              id
              attributes {
                name
                firstLastName
                secondLastName
                gender
                birthday
              }
            }
          }
          status: statusRequest
          specialtyOption {
            data {
              id
              attributes {
                specialty {
                  data {
                    id
                    attributes {
                      description
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_STATS_ASPIRANTS = gql`
  query StatsAspirants {
    aspirants: aspirants {
      meta {
        pagination {
          total
        }
      }
    }
    aspirantsEnviado: aspirants(filters: { statusRequest: { eq: "enviado" } }) {
      meta {
        pagination {
          total
        }
      }
    }
    aspirantsAprobado: aspirants(
      filters: { statusRequest: { eq: "aprobado" } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }
    aspirantsHombres: aspirants(
      filters: { user: { gender: { eq: "Hombre" } } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }
    aspirantsMujeres: aspirants(
      filters: { user: { gender: { eq: "Mujer" } } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }
  }
`;
