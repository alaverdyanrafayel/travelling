import { Model } from 'objection';

export class BookingDocument extends Model {
    id;
    booking_id;
    name;
    link;
    etag;

    static tableName = 'booking_documents';

    static jsonSchema = {
        type: 'object',
        required: ['booking_id',
            'name',
            'link',
            'etag'],
        properties: {
            id: {
                type: 'string',
                uniqueItems: true
            },
            booking_id: {
                type: 'integer'
            },
            name: {
                type: 'string'
            },
            link: {
                type: 'string'
            },
            etag: {
                type: 'string'
            }
        }
    };

    static relationMappings = {
        booking: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/booking`,
            join: {
                from: 'booking_documents.booking_id',
                to: 'bookings.id'
            }
        }
    };

    constructor() {
        super();
    }

    getFields() {
        return ['id', 'booking_id', 'name', 'link', 'etag'];
    }
}
