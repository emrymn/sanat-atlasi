// Testler için küçük veri kümesi yardımcıları
import { readFileSync } from 'node:fs';
const kok = new URL('../../', import.meta.url);
export const sanatcilar = JSON.parse(readFileSync(new URL('data/sanatcilar.json', kok), 'utf8'));
export const akimlar = JSON.parse(readFileSync(new URL('data/akimlar.json', kok), 'utf8'));
export const konular = JSON.parse(readFileSync(new URL('data/konular.json', kok), 'utf8'));
