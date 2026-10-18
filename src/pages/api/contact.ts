import type { APIRoute } from 'astro';
import { submitContact } from '../../lib/contact';

export const prerender = false;
export const POST: APIRoute = ({ request }) => submitContact(request);
