import { Model, Table, PrimaryKey, AutoIncrement, Column, AllowNull, Unique, DataType, CreatedAt, UpdatedAt, ForeignKey } from 'sequelize-typescript'
import { User } from './User';
@Table({ tableName: "Board" })
export class Board extends Model<Board> {

    @PrimaryKey
    @AutoIncrement
    @Column
    id: number

    @AllowNull(false)
    @Unique
    @Column({ type: DataType.STRING(256) ,allowNull: false })
    name: string

    // 连表查询
    @ForeignKey(()=>User)
    @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false})
    userId: number

    @CreatedAt
    createdAt: Date

    @UpdatedAt
    updatedAt: Date
}