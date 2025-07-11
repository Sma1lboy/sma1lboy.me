import { motion } from "framer-motion";
import { friends } from "@/constants/friends";
import { containerVariants, itemVariants } from "@/constants/home";

const FriendsSection = () => {
  return (
    <motion.div
      id="friends"
      className="py-24 sm:py-32"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div className="mx-auto max-w-2xl lg:mx-0" variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Friends
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            I'm lucky to be surrounded by a group of talented and inspiring
            individuals. Here are some of their amazing websites.
          </p>
        </motion.div>
        <motion.ul
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          variants={containerVariants}
        >
          {friends.map((friend) => (
            <motion.li key={friend.id} className="flex flex-col gap-y-4" variants={itemVariants}>
              <a href={friend.url} target="_blank" rel="noopener noreferrer">
                <div className="aspect-[3/2] w-full rounded-2xl overflow-hidden">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-8 tracking-tight text-foreground">
                  {friend.name}
                </h3>
                <p className="text-base leading-7 text-muted-foreground">
                  {friend.description}
                </p>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </motion.div>
  );
};

export default FriendsSection;
