import csv
import random

def filmUnion():

    list_of_films = []
    list_of_uri = []
    list_of_years = []

    with open('watchlist-_adenium-2023-11-23-01-37-utc.csv') as file_ingrid:
        ingrid_dict = csv.DictReader(file_ingrid)
        for row in ingrid_dict:
            list_of_films.append(row['Name'])
            list_of_years.append(row['Year'])
            list_of_uri.append(row['Letterboxd URI'])

    with open('watchlist-lgruelas-2023-11-23-15-44-utc.csv') as file_german:
        german_dict = csv.DictReader(file_german)
        for row in german_dict:
            if row['Name'] is not list_of_films:
                list_of_films.append(row['Name'])
            if row['Year'] is not list_of_years:
                list_of_years.append(row['Year'])
            if row['Letterboxd URI'] is not list_of_uri:
                list_of_uri.append(row['Letterboxd URI'])        

    random_choice = random.randint(0, len(list_of_films))
    print(list_of_films[random_choice], 'from', list_of_years[random_choice])
    print(list_of_uri[random_choice])


def filmIntersection():

    list_of_films_i = []
    list_of_uri_i = []
    list_of_years_i = []

    list_of_films_g = []
    list_of_uri_g = []
    list_of_years_g = []

    list_of_films = []
    list_of_uri = []
    list_of_years = []

    with open('watchlist-_adenium-2023-11-23-01-37-utc.csv') as file_ingrid:
        ingrid_dict = csv.DictReader(file_ingrid)
        for row in ingrid_dict:
            list_of_films_i.append(row['Name'])
            list_of_years_i.append(row['Year'])
            list_of_uri_i.append(row['Letterboxd URI'])

    with open('watchlist-lgruelas-2023-11-23-15-44-utc.csv') as file_german:
        german_dict = csv.DictReader(file_german)
        for row in german_dict:
            list_of_films_g.append(row['Name'])
            list_of_years_g.append(row['Year'])
            list_of_uri_g.append(row['Letterboxd URI'])

    for element in list_of_films_i:
        for e in list_of_films_g:
            if element == e:
                list_of_films.append(element)

    for element in list_of_uri_i:
        for e in list_of_uri_g:
            if element == e:
                list_of_uri.append(element)

    for element in list_of_years_i:
        for e in list_of_years_g:
            if element == e:
                list_of_years.append(element)
    
    random_choice = random.randint(0, len(list_of_films))
    print(list_of_films[random_choice], 'from', list_of_years[random_choice])
    print(list_of_uri[random_choice])

def filmIngrid():

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

def filmGerman():

    list_of_films = []
    list_of_uri = []
    list_of_years = []

    with open('watchlist-lgruelas-2023-11-23-15-44-utc.csv') as file_object:
        file_dict = csv.DictReader(file_object)
        for row in file_dict:
            list_of_films.append(row['Name'])
            list_of_years.append(row['Year'])
            list_of_uri.append(row['Letterboxd URI'])

    random_choice = random.randint(0, len(list_of_films))
    print(list_of_films[random_choice], 'from', list_of_years[random_choice])
    print(list_of_uri[random_choice])

print('Escribe el número de tu selección ')
print('1. Intersección')
print('2. Unión')
print('3. Ingrid Watchlist')
print('4. German Watchlist')
user_choice = input('... ')

if user_choice == '1':
    filmIntersection()
elif user_choice == '2':
    filmUnion()
elif user_choice == '3':
    filmIngrid()
elif user_choice == '4':
    filmGerman()
else:
    print('Reinicie y escoga una opción valida')
