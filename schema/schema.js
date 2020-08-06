const graphql = require('graphql')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLBoolean } = graphql

const Movies = require('../mongo-model/movies.js');
const Directors = require('../mongo-model/directors.js');







const MovieType = new GraphQLObjectType ({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString)},
        genre: { type: new GraphQLNonNull(GraphQLString)},
        watched: { type: new GraphQLNonNull(GraphQLBoolean)},
        rate: { type: new GraphQLInt},
        director: {
            type: DirectorType,
            resolve({ directorId }, args) {
                return Directors.findById(directorId)   
            }
        }

    })
})

const DirectorType = new GraphQLObjectType ({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString)},
        age: { type: new GraphQLNonNull(GraphQLString)},
        movies: {
            type: new GraphQLList(MovieType),
            resolve(id, args) {
                return Movies.find({directorId: id})   
            }
        }

    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, { name, age }) {
                const director = new Directors({
                    name,
                    age,
                });
                return director.save()
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                genre:{ type: new GraphQLNonNull(GraphQLString)},
                directorId: {type: GraphQLID}
            },
            resolve(parent, name, genre, directorId, watched, rate ) {
                const movie = new Movies({
                    name ,
                    genre ,
                    directorId ,
                    watched,
                    rate,

                });
                return movie.save();
            }
        },

        deleteMovie:{
          type: MovieType,
          args: { id: {type: GraphQLID } },
          resolve(parent, id) {
              return Movies.findByIdAndRemove(id)
          }

          
        },

        deleteDirector:{
            type: DirectorType,
            args: { id: {type: GraphQLID } },
            resolve(parent, { id }) {
                return Directors.findByIdAndRemove(id)
            }
  
       },
       updateDirector: {
        type: DirectorType,
        args: {
            id: { type: GraphQLID},
            name: { type: GraphQLString},
            age: { type: GraphQLInt }
        },
        resolve(parent, { id, name, age }) {
            
            return Directors.findByIdAndUpdate(
                id,
                { $set: { name , age }},
                {new: true}
                )
        }
    },
    updateMovie: {
        type: MovieType,
        args: {
            id: { type: GraphQLID},
            name: { type: GraphQLString},
            genre:{ type: GraphQLString},
            directorId: { type: GraphQLID},
            watched: { type: new GraphQLNonNull(GraphQLBoolean) },
            rate: { type: GraphQLInt }
        },
        resolve(parent, { id, name, genre,directorId, watched, rate }) {
            return Movies.findByIdAndUpdate(
                id,
                { $set: { name, genre, directorId, watched , rate }},
                {new: true}
            );
        }
    }
       
       
    }
})

const Query = new GraphQLObjectType ({
    name: 'Query',
    fields: { 
      movie: {
        type: MovieType,
        args: { id: {type: GraphQLID } },
        resolve(parent, { id }) {
            return Movies.findById(id)
            }
    },
    director: {
        type: DirectorType,
        args: { id: {type: GraphQLID } },
        resolve(parent, { id }) {
            return Directors.findById( id)
            }
    },

    movies: {
        type: new GraphQLList(MovieType),
        resolve() {
            return Movies.find({})
        }
    },
    directors: {
        type: new GraphQLList(MovieType),
        resolve() {
            return Directors.find({})
        }
    },

    }
})

module.exports = new GraphQLSchema ({
    query: Query,
    mutation: Mutation
    
})

