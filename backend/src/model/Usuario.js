const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
    static init(datapom) {
        super.init(
            {
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                senha: {
                    type: DataTypes.STRING(150),
                    allowNull: false,
                },
                foto: {
                    type: DataTypes.STRING(5000),
                    
                }
            },
            {
                sequelize: datapom,
                tableName: 'Usuarios',
                modelName: 'usuario'
            }
        );
    }
}

module.exports= Usuario