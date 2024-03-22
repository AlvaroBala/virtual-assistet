-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Mar 22, 2024 at 10:19 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `virtual_assistent`
--

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` varchar(255) DEFAULT NULL,
  `answer` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`) VALUES
(1, 'Heater not working', 'Please check if the heater is plugged in and the thermostat is set correctly.'),
(2, 'Water leak in bathroom', 'Please turn off the main water supply and call a plumber immediately.'),
(3, 'How to reset the heater', 'To reset the heater, unplug it for 30 seconds and then plug it back in.'),
(4, 'How to fix a leaky faucet?', 'If the faucet is leaking, try tightening the valve. If it persists, please call a plumber.'),
(5, 'Hi', 'Hello, how can I assist you?'),
(6, 'I need help', 'Sure, what do you need help with?'),
(7, 'Thank you', 'You’re welcome! Can I help with anything else?'),
(8, 'What services do you offer?', 'We provide assistance with water leaks, AC, and heater repairs.'),
(9, 'How to detect a water leak?', 'You can detect a water leak by checking for wet spots on the walls, floors, or listening for the sound of running water.'),
(10, 'AC maintenance tips?', 'Regular maintenance for AC includes cleaning or replacing filters, checking the thermostat, and ensuring the outside unit is clear of debris.'),
(11, 'Heater is not turning on, what to do?', 'If your heater is not turning on, check the thermostat settings, power supply, and if the pilot light is on for gas heaters.'),
(12, 'Why is my AC unit not working?', 'There are several reasons why an AC unit may not be working, including issues with the thermostat, a tripped breaker, or a refrigerant leak. Please check if the thermostat is set to cool and that the breaker has not been tripped. If the problem persists, it may require professional service.'),
(13, 'How to fix a jammed door?', 'To fix a jammed door, check for any obstructions in the track for sliding doors or for any warping or swelling in the case of hinged doors. Lubricating the hinges or tracks might also solve the issue. If the door is stuck due to paint, you might need to use a putty knife to gently break the seal.'),
(14, 'How should I prepare my home for gas installation?', 'Ensure that the area where the installation will take place is clear of any obstructions. It\'s also important to have proper ventilation and to secure pets and children away from the area.'),
(15, 'Is it safe to install a gas appliance on my own?', 'Installing gas appliances can be dangerous and should typically be performed by a certified professional to ensure it is done safely and in compliance with local regulations.'),
(16, 'What maintenance is required for my gas installation?', 'Regular maintenance by a qualified technician is important for safety and efficiency. This includes checking for leaks, ensuring vents are unobstructed, and inspecting the appliance connections.'),
(17, 'How do I choose the right blinds for my home?', 'Consider the room\'s purpose, window size, desired light control, privacy needs, and your decor style. Measure your windows accurately and decide if you want inside or outside mount blinds.'),
(18, 'How do I clean my window blinds?', 'Dust them regularly with a soft cloth or a vacuum with a brush attachment. For deeper cleaning, you can use a damp cloth with mild soap, but check the manufacturer\'s instructions first.'),
(19, 'Can I install window blinds by myself?', 'Yes, with the right tools and instructions, you can install window blinds. It\'s important to follow the manufacturer\'s guidelines and ensure that you have measured your windows correctly.');

-- --------------------------------------------------------

--
-- Table structure for table `faq_keywords`
--

CREATE TABLE `faq_keywords` (
  `faq_id` int(11) DEFAULT NULL,
  `keyword` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faq_keywords`
--

INSERT INTO `faq_keywords` (`faq_id`, `keyword`) VALUES
(1, 'heater malfunction'),
(2, 'bathroom water overflow'),
(2, 'water pipe burst'),
(2, 'bathroom flooding'),
(3, 'resetting heater'),
(3, 'heater reset'),
(5, 'greeting response'),
(5, 'say hello'),
(5, 'greeting chatbot'),
(5, 'morning greeting'),
(5, 'afternoon hello'),
(5, 'evening salutation'),
(6, 'need assistance'),
(6, 'requesting support'),
(6, 'help needed'),
(6, 'problem assistance'),
(6, 'issue support'),
(7, 'expressing gratitude'),
(7, 'saying thanks'),
(7, 'appreciation'),
(7, 'being grateful'),
(7, 'thank you reply'),
(8, 'service offerings'),
(8, 'what we provide'),
(8, 'assistance provided'),
(8, 'repair services'),
(8, 'services available'),
(9, 'water leak detection'),
(9, 'finding water leaks'),
(9, 'water leak spotting'),
(9, 'signs of water leak'),
(9, 'hearing water running'),
(10, 'AC upkeep advice'),
(10, 'air conditioner care'),
(10, 'AC care tips'),
(10, 'maintaining air conditioner'),
(10, 'cleaning AC filters'),
(11, 'heater won’t start'),
(11, 'heater troubleshooting'),
(11, 'gas heater pilot light'),
(11, 'checking heater thermostat'),
(12, 'AC unit failure'),
(12, 'air conditioner issues'),
(12, 'AC troubleshooting'),
(12, 'AC service request'),
(12, 'AC cooling problem'),
(12, 'AC thermostat setting'),
(12, 'tripped AC breaker'),
(12, 'AC refrigerant issue'),
(13, 'jammed door'),
(13, 'door broken'),
(13, 'door stuck'),
(13, 'lubricate hinges'),
(13, 'door obstructions'),
(13, 'unstick door'),
(13, 'door repair'),
(13, 'swollen door'),
(13, 'door warping'),
(13, 'track obstruction'),
(4, 'leaky faucet'),
(4, 'faucet repair'),
(4, 'tighten valve'),
(4, 'call plumber'),
(4, 'plumbing issue'),
(14, 'gas installation preparation'),
(14, 'home readiness for gas install'),
(14, 'gas install area prep'),
(15, 'gas appliance safety'),
(15, 'professional gas installation'),
(15, 'DIY gas appliance risks'),
(16, 'gas installation maintenance'),
(16, 'gas leak checks'),
(16, 'gas vents inspection'),
(17, 'choosing blinds'),
(17, 'blinds selection guide'),
(17, 'window measurements for blinds'),
(18, 'cleaning blinds'),
(18, 'dusting window blinds'),
(18, 'washing blinds'),
(19, 'blinds installation'),
(19, 'DIY window blinds'),
(19, 'installing blinds guide');

-- --------------------------------------------------------

--
-- Table structure for table `servicecategories`
--

CREATE TABLE `servicecategories` (
  `id` int(11) NOT NULL,
  `question_id` int(11) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `servicecategories`
--

INSERT INTO `servicecategories` (`id`, `question_id`, `category`) VALUES
(1, 1, 'Boiler'),
(2, 2, 'Plumbing'),
(3, 3, 'Boiler'),
(4, 4, 'Plumbing'),
(5, 9, 'Plumbing'),
(6, 10, 'AC'),
(7, 11, 'AC'),
(8, 12, 'AC'),
(9, 13, 'Locksmith'),
(10, 15, 'Gas'),
(11, 14, 'Gas'),
(12, 15, 'Gas'),
(13, 14, 'Gas'),
(14, 16, 'Gas'),
(15, 17, 'Blinds'),
(16, 16, 'Gas'),
(17, 17, 'Blinds'),
(18, 18, 'Blinds'),
(19, 19, 'Blinds'),
(20, 18, 'Blinds'),
(21, 19, 'Blinds');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `faqs` ADD FULLTEXT KEY `question` (`question`,`answer`);

--
-- Indexes for table `faq_keywords`
--
ALTER TABLE `faq_keywords`
  ADD KEY `faq_id` (`faq_id`);

--
-- Indexes for table `servicecategories`
--
ALTER TABLE `servicecategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `servicecategories`
--
ALTER TABLE `servicecategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `faq_keywords`
--
ALTER TABLE `faq_keywords`
  ADD CONSTRAINT `faq_keywords_ibfk_1` FOREIGN KEY (`faq_id`) REFERENCES `faqs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `servicecategories`
--
ALTER TABLE `servicecategories`
  ADD CONSTRAINT `servicecategories_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `faqs` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
