import { CronJob } from 'cron';
import { sendDueDateReminders, checkOverdueBooks } from './notification-tasks';

// Track running status with flags
let isDueDateJobRunning = false;
let isOverdueJobRunning = false;

// Run daily at 10:00 AM
export const dueDateReminderJob = new CronJob(
  '0 10 * * *',
  async function() {
    console.log('Running due date reminder job');
    try {
      await sendDueDateReminders();
    } catch (error) {
      console.error('Error in due date reminder job:', error);
    }
  },
  null,
  false, // Don't start automatically
  'Asia/Dhaka' // Timezone for Bangladesh
);

// Run daily at 12:00 PM
export const overdueCheckJob = new CronJob(
  '0 12 * * *',
  async function() {
    console.log('Running overdue check job');
    try {
      await checkOverdueBooks();
    } catch (error) {
      console.error('Error in overdue check job:', error);
    }
  },
  null,
  false, // Don't start automatically
  'Asia/Dhaka' // Timezone for Bangladesh
);

export function startScheduledJobs() {
  console.log('Starting scheduled notification jobs');
  
  try {
    if (!isDueDateJobRunning) {
      dueDateReminderJob.start();
      isDueDateJobRunning = true;
      console.log('Due date reminder job started');
    }
    
    if (!isOverdueJobRunning) {
      overdueCheckJob.start();
      isOverdueJobRunning = true;
      console.log('Overdue check job started');
    }
  } catch (error) {
    console.error('Failed to start jobs:', error);
  }
}

export function stopScheduledJobs() {
  console.log('Stopping scheduled notification jobs');
  
  try {
    if (isDueDateJobRunning) {
      dueDateReminderJob.stop();
      isDueDateJobRunning = false;
      console.log('Due date reminder job stopped');
    }
    
    if (isOverdueJobRunning) {
      overdueCheckJob.stop();
      isOverdueJobRunning = false;
      console.log('Overdue check job stopped');
    }
  } catch (error) {
    console.error('Failed to stop jobs:', error);
  }
}

// Function to run the jobs manually (for testing or one-off runs)
export async function runJobsManually() {
  console.log('Running notification jobs manually');
  
  try {
    console.log('Running due date reminders...');
    const dueDateResult = await sendDueDateReminders();
    console.log('Due date reminders result:', dueDateResult);
    
    console.log('Running overdue check...');
    const overdueResult = await checkOverdueBooks();
    console.log('Overdue check result:', overdueResult);
    
    return { dueDateResult, overdueResult };
  } catch (error) {
    console.error('Error running jobs manually:', error);
    return { error };
  }
} 