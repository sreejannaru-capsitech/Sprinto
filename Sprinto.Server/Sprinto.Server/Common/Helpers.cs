namespace Sprinto.Server.Common
{
    public static class Helpers
    {
        public static DateTime EndOfDay(this DateTime date)
        {
            return new DateTime(date.Year, date.Month, date.Day, 23, 59, 59, 999);
        }

        /// <summary>
        /// Returns the Start of the given day (the first millisecond of the given System.DateTime).
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>        
        public static DateTime BeginningOfDay(this DateTime date)
        {
            return new DateTime(date.Year, date.Month, date.Day, 0, 0, 0, 0);
        }
    }
}
