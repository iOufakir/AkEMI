CREATE TABLE `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `plant` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `name` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `growing_season` TEXT NOT NULL,
  `light_requirement` TEXT NOT NULL,
  `temperature_requirement` CHAR(100) NOT NULL,
  `liquid_fertilizer_need` TEXT NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



INSERT INTO `user` (`username`, `email`, `password`) VALUES ('test', 'test@example.com', 'test');
