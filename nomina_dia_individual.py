import pandas as pd 
import csv
  
# read an excel file and convert  
# into a dataframe object 
read_file = pd.DataFrame(pd.read_excel("Report.xls", "Reporte de Asistencia")) 
  
# Write the dataframe object 
# into csv file 
read_file.to_csv ("reporte_csv.csv",  
                  index = None, 
                  header=True) 

with open('reporte_csv.csv', mode='r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    checks = []
    for row in csv_reader:
        checks.append(f'Lunes {row["Reporte de Eventos de Asistencia"]} Martes {row["Unnamed: 1"]} Miercoles {row["Unnamed: 2"]} Jueves {row["Unnamed: 3"]} Viernes {row["Unnamed: 4"]}')
    del(checks[:2])    
    del(checks[1:7])
    checks_cleaned = []
    checks_cleaned.append(checks[0])
    checks_cleaned.append(checks[2])
    checks_cleaned.append(checks[4])
    checks_cleaned.append(checks[6])
    checks_cleaned.append(checks[8])
    checks_cleaned.append(checks[10])
    checks_cleaned.append(checks[14])
    checks_splitted = []
    lista_separada = []
    for i in checks_cleaned:
        checks_splitted = i.split(' ')
        lista_separada.append(checks_splitted)
    for i in lista_separada:
        if lista_separada.index(i) != 0:
            for n in i:
                if i.index(n)%2 != 0:
                    if i.index(n) != 9:
                        index = i.index(n)
                        entrada = n[:5]
                        salida = n[5:]
                        if entrada != '':
                            entrada_hrs = int(entrada[:2])
                            entrada_min = int(entrada[3:])
                            entrada_conv = entrada_hrs*60+entrada_min
                        else:
                            entrada_conv = 0
                        if salida != '':
                            salida_hrs = int(salida[:2])
                            salida_min = int(salida[3:])
                            salida_conv = salida_hrs*60+salida_min
                            min_trabajados = salida_conv - entrada_conv
                        else:
                            min_trabajados = 0
                        del(i[i.index(n)])
                        i.insert(index, min_trabajados)
                    else:
                        index = i.index(n)
                        entrada = n[:5]
                        if entrada != '':
                            entrada_hrs = int(entrada[:2])
                            entrada_min = int(entrada[3:])
                            entrada_conv = entrada_hrs*60+entrada_min
                            min_trabajados = 1080 - entrada_conv
                        else:
                            min_trabajados = 0
                        del(i[i.index(n)])
                        i.insert(index, min_trabajados)

    schedule = {}
    schedule['Periodo'] = lista_separada[0]
    schedule['Yesly'] = lista_separada[1]
    schedule['Samuel'] = lista_separada[2]
    schedule['Sandry'] = lista_separada[3]
    schedule['Angel'] = lista_separada[4]
    schedule['Alonso'] = lista_separada[5]
    schedule['Ingrid'] = lista_separada[6]

    print('Total de horas trabajadas:\n', schedule)

    

    for key in schedule:
        lista = schedule[key]
        days_dict = {}
        for i in lista:
            ind = lista.index(i)
            if ind%2 == 0:
                days_dict[i]=lista[ind+1]
        schedule[key] = days_dict
    
    def missing_hours(nombre):
        entrada = input('\n\nIntroduzca hora de entrada para {nombre} el día {dia} (formato 24hrs 00:00): '.format(nombre=nombre, dia=key))
        salida = input('Introduzca hora de salida para {nombre} el día {dia} (formato 24hrs 00:00): '.format(nombre=nombre, dia=key))
        entrada_hrs = int(entrada[:2])
        entrada_min = int(entrada[3:])
        entrada_conv = entrada_hrs*60+entrada_min
        salida_hrs = int(salida[:2])
        salida_min = int(salida[3:])
        salida_conv = salida_hrs*60+salida_min
        min_trabajados = salida_conv - entrada_conv
        if min_trabajados <= 600 and 0 < min_trabajados:
            sueldo_diario = min_trabajados*salarios[nombre]
        else:
            tiempo_extra = min_trabajados-600
            sueldo_tiempo_extra = tiempo_extra*salarios[nombre]*2
            sueldo_diario = salarios[nombre]*600 + sueldo_tiempo_extra
        return sueldo_diario


    #Salario por minuto normal
    salarios = {
        'Yesly': 2200/3000, 
        'Samuel': 2700/3000, #seguro 3694.39 a la quincena
        'Sandry': 1800/3000,
        'Angel': 3500/3000, #seguro 3694.39 a la quincena
        'Alonso': 2300/3000,
        'Ingrid': 1800/3000, 
    }
    #Tiempo extra es el doble 

    #PAGO YESLY
    sueldo_semanal_yesly = 0
    for key in schedule['Yesly']: #440 diarios
        min_trabajados = schedule['Yesly'][key] 
        if min_trabajados <= 600 and 0 < min_trabajados:
            sueldo_diario = min_trabajados*salarios['Yesly']
        elif min_trabajados == 0:
            sueldo_diario = missing_hours('Yesly')    
        else:
            tiempo_extra = min_trabajados-600
            sueldo_tiempo_extra = tiempo_extra*salarios['Yesly']*2
            sueldo_diario = salarios['Yesly']*600 + sueldo_tiempo_extra
        sueldo_semanal_yesly += sueldo_diario
        schedule['Yesly'][key] = sueldo_diario
    print('\n Yesly')
    print('Salario por día:\n',schedule['Yesly'])
    print('Sueldo semanal:',sueldo_semanal_yesly)

    #PAGO SAMUEL
    sueldo_semanal_samuel = 0
    for key in schedule['Samuel']: #540 diarios
        min_trabajados = schedule['Samuel'][key] 
        if min_trabajados <= 600 and 0 < min_trabajados:
            sueldo_diario = min_trabajados*salarios['Samuel']
        elif min_trabajados == 0:
            sueldo_diario = missing_hours('Samuel')    
        else:
            tiempo_extra = min_trabajados-600
            sueldo_tiempo_extra = tiempo_extra*salarios['Samuel']*2
            sueldo_diario = salarios['Samuel']*600 + sueldo_tiempo_extra
        sueldo_semanal_samuel += sueldo_diario
        schedule['Samuel'][key] = sueldo_diario
    print('\n Samuel')
    print('Salario por día:\n',schedule['Samuel'])
    print('Sueldo semanal:',sueldo_semanal_samuel)

    #SALARIO SANDRY
    sueldo_semanal_sandry = 0
    for key in schedule['Sandry']: #360 diarios 
        min_trabajados = schedule['Sandry'][key] 
        if min_trabajados <= 600 and 0 < min_trabajados:
            sueldo_diario = min_trabajados*salarios['Sandry']
        elif min_trabajados == 0:
            sueldo_diario = missing_hours('Sandry')    
        else:
            tiempo_extra = min_trabajados-600
            sueldo_tiempo_extra = tiempo_extra*salarios['Sandry']*2
            sueldo_diario = salarios['Sandry']*600 + sueldo_tiempo_extra
        sueldo_semanal_sandry += sueldo_diario
        schedule['Sandry'][key] = sueldo_diario
    print('\n Sandri')
    print('Salario por día:\n',schedule['Sandry'])
    print('Sueldo semanal:',sueldo_semanal_sandry)

    #SALARIO ANGEL
    sueldo_semanal_angel = 0
    for key in schedule['Angel']: #640 diarios
        min_trabajados = schedule['Angel'][key] 
        if min_trabajados <= 600 and 0 < min_trabajados:
            sueldo_diario = min_trabajados*salarios['Angel']
        elif min_trabajados == 0:
            sueldo_diario = missing_hours('Angel')    
        else:
            tiempo_extra = min_trabajados-600
            sueldo_tiempo_extra = tiempo_extra*salarios['Angel']*2
            sueldo_diario = salarios['Angel']*600 + sueldo_tiempo_extra
        sueldo_semanal_angel += sueldo_diario
        schedule['Angel'][key] = sueldo_diario
    print('\n Angel')
    print('Salario por día:\n',schedule['Angel'])
    print('Sueldo semanal:',sueldo_semanal_angel)

    #SALARIO ALONSO
    sueldo_semanal_alonso = 0
    for key in schedule['Alonso']: #640 diarios
        min_trabajados = schedule['Alonso'][key] 
        if min_trabajados <= 600 and 0 < min_trabajados:
            sueldo_diario = min_trabajados*salarios['Alonso']
        elif min_trabajados == 0:
            sueldo_diario = missing_hours('Alonso')   
        else:
            tiempo_extra = min_trabajados-600
            sueldo_tiempo_extra = tiempo_extra*salarios['Alonso']*2
            sueldo_diario = salarios['Alonso']*600 + sueldo_tiempo_extra
        sueldo_semanal_alonso += sueldo_diario
        schedule['Alonso'][key] = sueldo_diario
    print('\n Alonso')
    print('Salario por día:\n',schedule['Alonso'])
    print('Sueldo semanal:',sueldo_semanal_alonso)

    #SALARIO INGRID
    sueldo_semanal_ingrid = 0
    for key in schedule['Ingrid']: #360 diarios
        min_trabajados = schedule['Ingrid'][key] 
        if min_trabajados <= 540 and 0 < min_trabajados:
            sueldo_diario = min_trabajados*salarios['Ingrid']
        elif min_trabajados == 0:
            entrada = input('\n\nIntroduzca hora de entrada para {nombre} el día {día} (formato 24hrs 00:00): '.format(nombre='Ingrid', día=key))
            salida = input('Introduzca hora de salida para {nombre} el día {día} (formato 24hrs 00:00): '.format(nombre='Ingrid', día=key))
            entrada_hrs = int(entrada[:2])
            entrada_min = int(entrada[3:])
            entrada_conv = entrada_hrs*60+entrada_min
            salida_hrs = int(salida[:2])
            salida_min = int(salida[3:])
            salida_conv = salida_hrs*60+salida_min
            min_trabajados = salida_conv - entrada_conv
            if min_trabajados <= 540 and 0 < min_trabajados:
                sueldo_diario = min_trabajados*salarios['Ingrid']
            else:
                tiempo_extra = min_trabajados-540
                sueldo_tiempo_extra = tiempo_extra*salarios['Ingrid']*2
                sueldo_diario = salarios['Ingrid']*540 + sueldo_tiempo_extra
        else:
            tiempo_extra = min_trabajados-540
            sueldo_tiempo_extra = tiempo_extra*salarios['Ingrid']*2
            sueldo_diario = salarios['Ingrid']*540 + sueldo_tiempo_extra
        sueldo_semanal_ingrid += sueldo_diario
        schedule['Ingrid'][key] = sueldo_diario
    print('\n Ingrid')
    print('Salario por día:\n',schedule['Ingrid'])
    print('Sueldo semanal:',sueldo_semanal_ingrid)




    
