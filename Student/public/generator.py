import random

# Formulas based on the abacus rules
big_friend = {9: (10, -1), 8: (10, -2), 7: (10, -3), 6: (10, -4)}
small_friend_add = {4: (-1, 5), 3: (-2, 5), 2: (-3, 5), 1: (-4, 5)}
small_friend_sub = {4: (1, -5), 3: (2, -5), 2: (3, -5), 1: (4, -5)}
combination_friend_add = {6: (10, -5, 1), 7: (10, -5, 2), 8: (10, -5, 3), 9: (10, -5, 4)}

def apply_formula(base, formula):
    return [base] + list(formula)

def generate_row():
    question_types = ["big_friend", "small_friend_add", "small_friend_sub", "combination_friend_add"]
    q_type = random.choice(question_types)
    
    if q_type == "big_friend":
        bf_key = random.choice(list(big_friend.keys()))
        row = apply_formula(random.randint(51, 99), big_friend[bf_key])
    elif q_type == "small_friend_add":
        sf_key = random.choice(list(small_friend_add.keys()))
        row = apply_formula(random.randint(51, 99), small_friend_add[sf_key])
    elif q_type == "small_friend_sub":
        sf_key = random.choice(list(small_friend_sub.keys()))
        row = apply_formula(random.randint(51, 99), small_friend_sub[sf_key])
    elif q_type == "combination_friend_add":
        cf_key = random.choice(list(combination_friend_add.keys()))
        row = apply_formula(random.randint(51, 99), combination_friend_add[cf_key])
    
    if random.random() < 0.65:
        row[random.randint(1, len(row)-1)] = -random.choice([1, 2, 3, 4])
    
    if row[1] < 0:
        while row[0] <= abs(row[1]):
            row[0] = random.randint(abs(row[1]) + 1, 99)
    
    while len(row) < 4:
        row.append(random.randint(1, 99))
    if len(row) > 5:
        row = row[:5]
    
    total = sum(row)
    if total < 0:
        return None

    return row

def generate_options_and_answer(row):
    correct_answer = sum(row)
    options = [correct_answer]
    
    while len(options) < 3:
        option = correct_answer + random.choice([-6,-2, -1, 8, 2, 10])
        if option != correct_answer and option not in options and option > 0:
            options.append(option)
    
    random.shuffle(options)
    return options, correct_answer

def generate_questions(num_questions):
    questions = []
    while len(questions) < num_questions:
        row = None
        while row is None:
            row = generate_row()
        if 1 <= sum(row) <= 60:
            options, correct_answer = generate_options_and_answer(row)
            question_html = {
                "question": ''.join([f'<p>{num}</p>' for num in row]),
                "options": options,
                "answer": correct_answer
            }
            questions.append(question_html)
    return questions

def main():
    num_questions = 100
    questions = generate_questions(num_questions)
    print("Generated Questions (Formatted):")
    for i, q in enumerate(questions):
        end = ',' if i < len(questions) - 1 else ''
        print(f'{{"question": "{q["question"]}", "options": {q["options"]}, "answer": {q["answer"]}}}{end}')



main()
