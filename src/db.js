import Knex from 'knex';
import { Model } from 'objection';
import database from './app/configs/database';

Model.knex(Knex(database));
