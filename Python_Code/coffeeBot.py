import csv
import time

list_of_orders = []
dict_order = {}
time_order = time.asctime()
dict_order["Time order"] = time_order

def coffee_bot():
  print('Welcome to the cafe!')
  order()
 
def order():
    size = get_size()
    drink_type = get_drink_type()
    cup = get_cup()
    temperature = get_temperature()
    print('Alright, that\'s a {} {} {} in {}!'.format(size, temperature, drink_type, cup))
    drink_order = '{} {} {} in {}'.format(size, temperature, drink_type, cup)
    list_of_orders.append(drink_order)
    another_order()

def another_order():
    res = input('Would you like to order another drink? \n[y] Yes \n[n] No \n')
    if res == 'y':
        return order()
    elif res == 'n':
        name = input('Can I get your name please? \n')
        print('Thanks, {name}! Your drink will be ready shortly.'.format(name=name))
        dict_order['Name'] = name
    else:
        print_message()
        return another_order()

def get_cup():
    res = input('Do you have your own cup or do you prefer a plastic one? \n[a] I have my own cup \n[b] I want a plastic cup \n')
    if res == 'a':
        return 'a reusable cup'
    elif res == 'b':
        return 'a plastic cup'
    else:
        print_message()
        return get_cup()

def get_temperature():
    res = input('How do you like your drink? \n[a] Iced \n[b] Hot \n')
    if res == 'a':
        return 'iced'
    elif res == 'b':
        return 'hot'
    else:
        print_message()
        return get_cup()

def get_size():
    res = input('What size drink can I get for you? \n[a] Small \n[b] Medium \n[c] Large \n> ')
    if res == 'a':
        return 'small'
    elif res == 'b':
        return 'medium'
    elif res == 'c':
        return 'large'
    else:
        print_message()
        return get_size()

def print_message():
    print('I\'m sorry, I did not understand your selection. Please enter the corresponding letter for your response.')

def get_drink_type():
    res = input('What type of drink would you like? \n[a] Brewed Coffee \n[b] Mocha \n[c] Latte \n')
    if res == 'a':
        return 'brewed coffee'
    elif res == 'b':
        return 'mocha'
    elif res == 'c':
        return order_latte()
    else:
        print_message()
        return get_drink_type()

def order_latte():
    res = input('And what kind of milk for your latte? \n[a] 2% milk \n[b] Non-fat milk \n[c] Soy milk \n')
    if res == 'a':
        return 'latte'
    elif res == 'b':
        return 'non-fat latte'
    elif res == 'c':
        return 'soy latte'
    else:
        print_message()
        return get_size()



# Call coffee_bot()!
coffee_bot()

dict_order["No of drinks"] = len(list_of_orders)
dict_order["Drinks"] = list_of_orders

with open('orders.csv', 'a') as orders_csv:
  fields = ['Time order', 'Name', 'No of drinks', 'Drinks']
  output_writer = csv.DictWriter(orders_csv, fieldnames=fields)
  output_writer.writerow(dict_order)

