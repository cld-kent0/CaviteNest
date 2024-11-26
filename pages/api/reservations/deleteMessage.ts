import { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/app/libs/prismadb"; // Adjust the path if necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { messageId, listingId } = req.body;

  if (!messageId || !listingId) {
    return res.status(400).json({ message: 'Missing messageId or listingId' });
  }

  try {
    // Perform the deletion from the database directly
    const deletedMessage = await prisma.message.delete({
      where: { id: messageId },
    });

    if (deletedMessage) {
      return res.status(200).json({ message: 'Message deleted successfully' });
    } else {
      return res.status(500).json({ message: 'Failed to delete message' });
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ message: 'Failed to delete message' });
  }
}
