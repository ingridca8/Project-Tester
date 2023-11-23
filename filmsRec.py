import csv
import random

list_of_films = []
list_of_uri = []
list_of_years = []

with open('watchlist-_adenium-2023-11-23-01-37-utc.csv') as file_object:
    file_dict = csv.DictReader(file_object)
    for row in file_dict:
        list_of_films.append(row['Name'])
        list_of_years.append(row['Year'])
        list_of_uri.append(row['Letterboxd URI'])

random_choice = random.randint(0, len(list_of_films))
print(list_of_films[random_choice], 'from', list_of_years[random_choice])
print(list_of_uri[random_choice])

#print(random.choice(list_of_films))
