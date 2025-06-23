import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10', // Use the latest Stripe API version or the one you support
});


const prisma = new PrismaClient();

const userService = {

  async createUser(body) {
    try {
      const { email, name, paymentId } = body;
      let user;

      if(paymentId !==null && paymentId !== undefined && paymentId !== '') {
          
      user = await prisma.user.create({
        data: {
          email,
          name,
          paymentId,
          ispaid: true
        }
      });
      }
      else {
        user = await prisma.user.create({
          data: {
            email,
            name,
            ispaid: false
          }
        });
      }
   console.log("User created successfully:", user);
      console.log("User created successfully");
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        where: {
          AND: [
            { email: { not: null } },
            { name: { not: null } },
            { paymentId: { not: null } }
          ]
        }
      });
      
      const usersWithHistory = await Promise.all(
        users.map(async (user) => {
          if (user.paymentId) {
            try {
              const paymentIntent = await stripe.paymentIntents.retrieve(user.paymentId);
              return {
                ...user,
                ...paymentIntent
              };
            } catch (stripeError) {
              console.error(`Error fetching Stripe data for user ${user.id}:`, stripeError);
              return null; // Return null if payment intent not found
            }
          }
          return null; // Return null if no paymentId
        })
      );
      
      // Filter out null values (users without valid payment intents)
      return usersWithHistory.filter(user => user !== null);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

};

export default userService;
