import { connect } from 'mongoose';

export function connectToDatabase(connection: string) {
  return connect(connection);
}
