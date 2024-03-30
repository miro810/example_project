import { DataTypes } from 'sequelize'
import DBInstance from '../DbSettings'
import type { IBrand, ICart, ICartDevice, ICategory, IDevice, IDeviceInfo, IRating, IUser } from '../interfaces/models'
import type { MyModel, MyStaticModel } from '../interfaces/utils'

const User: MyStaticModel<IUser> = DBInstance.define<MyModel<IUser>>(
	'User',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		email: { type: DataTypes.STRING, unique: true },
		password: { type: DataTypes.STRING },
		role: { type: DataTypes.STRING, defaultValue: 'USER' },
		img: { type: DataTypes.STRING },
	},
	{ timestamps: false },
)

const Cart: MyStaticModel<ICart> = DBInstance.define<MyModel<ICart>>(
	'Cart',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	},
	{ timestamps: false },
)

const CartDevice: MyStaticModel<ICartDevice> = DBInstance.define<MyModel<ICartDevice>>(
	'CartDevice',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		CartId: { type: DataTypes.INTEGER },
		DeviceId: { type: DataTypes.INTEGER },
		count: { type: DataTypes.INTEGER },
	},
	{ timestamps: false },
)

const Device: MyStaticModel<IDevice> = DBInstance.define<MyModel<IDevice>>(
	'Device',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: { type: DataTypes.STRING, allowNull: false },
		price: { type: DataTypes.INTEGER, allowNull: false },
		rating: { type: DataTypes.DOUBLE, defaultValue: 0 },
		img: { type: DataTypes.STRING, allowNull: false },
	},
	{ timestamps: false },
)

const DeviceInfo: MyStaticModel<IDeviceInfo> = DBInstance.define<MyModel<IDeviceInfo>>(
	'DeviceInfo',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		title: { type: DataTypes.STRING },
		description: { type: DataTypes.STRING },
	},
	{ timestamps: false },
)

const Rating: MyStaticModel<IRating> = DBInstance.define<MyModel<IRating>>(
	'Rating',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		rate: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 0,
				max: 5,
			},
		},
		UserId: { type: DataTypes.INTEGER },
		DeviceId: { type: DataTypes.INTEGER },
	},
	{ timestamps: false },
)

const Category: MyStaticModel<ICategory> = DBInstance.define<MyModel<ICategory>>(
	'Category',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: { type: DataTypes.STRING, unique: true, allowNull: false },
	},
	{ timestamps: false },
)

const Brand: MyStaticModel<IBrand> = DBInstance.define<MyModel<IBrand>>(
	'Brand',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: { type: DataTypes.STRING, unique: true, allowNull: false },
	},
	{ timestamps: false },
)

type IntermediateTable = { id: number }
const IntermediateTable: MyStaticModel<IntermediateTable> = DBInstance.define<MyModel<IntermediateTable>>(
	'IntermediateTable',
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	},
	{ timestamps: true },
)

User.hasOne(Cart)
User.hasMany(Rating)

Cart.belongsTo(User)
Cart.hasMany(CartDevice)

CartDevice.belongsTo(Cart)
CartDevice.belongsTo(Device)

Device.belongsTo(Category)
Device.belongsTo(Brand)
Device.hasMany(Rating)
Device.hasMany(CartDevice)
Device.hasOne(DeviceInfo, { as: 'DeviceInfo' })

Rating.belongsTo(User)
Rating.belongsTo(Device)

Category.hasMany(Device, { as: 'Category' })
Brand.hasMany(Device, { as: 'Brand' })

Category.belongsToMany(Brand, { through: IntermediateTable })
Brand.belongsToMany(Category, { through: IntermediateTable })

export { Brand, Cart, CartDevice, Category, Device, DeviceInfo, IntermediateTable, Rating, User }
