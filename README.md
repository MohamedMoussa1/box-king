# Box King
A Web app that generates QR Codes for boxes, linking them to their contents. This would be useful for someone who is relocating from a residence to another.

## Progress Demo
https://youtu.be/D0fZhI3hgg8 - 2025-05-08

https://youtu.be/fvdplRS0B4o - 2025-03-25

## Tech Stack and Architecture Design
Tech Stack: Python, Django, PostgreSQL, React, Material UI, Datamuse

Architecture Design: MVT, REST

## User Stories

1. As a user, I want to generate a QR code that links to a list of items, so that I can print and attach the QR code to a box and scan it to view my list of items

2. As a user, I want to be able to name the QR code generated (eg. Box1, Box2, ...), so that I can differentiate between my boxes

3. As a user, I want to be able to edit the list of items linked to a QR code, so that if I remove or add more items to my box, I can update the list of items linked to a QR code

4. As a user, I want my QR code to be accessible only by my login information, so that other people cannot scan the QR code and see the list of items in my box

5. As a user, I want to view a dashboard with all of the QR codes generated, so that I can access the QR codes anytime

6. As a user, I want to have word predictions while I'm inputting an item name to the list of items, so that the input process is less tedious

7. As a user, I want to be able to search my QR codes by item name, so that I can quickly find the box having that item

8. As a user, I want the option to send the QR code to my email upon generation, so that the printing process is facilitated

9. As a user, I want to be able to label QR codes by category (eg. clothes, kitchen, ...), so that my dashboard is organized

10. As a user, I want to be able to choose the color of the QR code being generated, so that I can have a customized experience
