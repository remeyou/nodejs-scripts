// reference: https://geshan.com.np/blog/2023/03/inquirer-js
import checkbox from '@inquirer/checkbox';
import input from '@inquirer/input';
import axios from 'axios';
import { errorFmt, inquirerErr, successFmt } from '../utils';

async function guessGender(firstName: string) {
  const response = await axios.get(
    `https://api.genderize.io?name=${firstName}`,
  );
  const { gender, probability } = response.data;
  console.log(
    `The API guessed the gender for ${successFmt(firstName)} to be ${successFmt(
      gender,
    )} with ${successFmt((probability * 100).toFixed(2))} probability`,
  );
}

async function guessNationality(firstName: string) {
  const response = await axios.get(
    `https://api.nationalize.io?name=${firstName}`,
  );
  const { country } = response.data;
  if (!country || !country[0]) {
    console.log(
      `The API could not guess the nationality for the name ${successFmt(
        firstName,
      )}`,
    );
    return;
  }
  const countryResponse = await axios.get(
    `https://api.worldbank.org/v2/country/${country[0].country_id}?format=json`,
  );
  console.log(
    `The API guessed the nationality for ${successFmt(
      firstName,
    )} to be ${successFmt(
      countryResponse.data[1][0].name,
    )} with the highest probability of ${successFmt(
      (country[0].probability * 100).toFixed(2) + '%',
    )}`,
  );
}

const getFirstName = async () => {
  return await input({
    message: 'What is your first name?',
    validate: (firstName) => {
      const len = firstName.length;
      if (!len) {
        return 'Please provide a first name';
      }
      if (len < 3 || len >= 20) {
        return 'Please provide a first name between 3 and 20 characters long';
      }
      return true;
    },
    transformer: (firstName, { isFinal }) => {
      if (isFinal) {
        return firstName.trim();
      }
      return firstName;
    },
  });
};

const getOptions = async (): Promise<string[]> => {
  const options = await checkbox({
    message: 'What would you like to guess for the given first name?',
    choices: [{ value: 'gender' }, { value: 'nationality' }],
  });
  if (!options.length) {
    console.log(
      errorFmt(
        'Choose at least one of the above, use space to choose the option',
      ),
    );
    return await getOptions();
  }
  return options;
};

async function guessGame() {
  let firstName = '';
  let options: string[] = [];
  try {
    firstName = await getFirstName();
    options = await getOptions();
  } catch (error) {
    inquirerErr(error as Error);
    return;
  }
  console.log('Calling API(s) might task some time...');
  try {
    for (const option of options) {
      if (option === 'gender') {
        await guessGender(firstName);
      }
      if (option === 'nationality') {
        await guessNationality(firstName);
      }
    }
  } catch (error) {
    console.error(
      errorFmt('There was an error while talking to them API:'),
      error,
    );
  }
}

export default guessGame;
